import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { reachedRateLimit } from '../../utils/RateLimit'
import { TikhubClient } from '../../utils/TikhubClient'

interface VideoResult {
  title?: string
  videoInfo: {
    duration: number
    urls: {
      type: number
      downloadUrl: string
      width?: number
      height?: number
      mimeType?: string
    }[]
  }
}

export default eventHandler(async (event): Promise<ApiResponse<VideoResult | null>> => {
  try {
    const body = await readBody(event)
    const { url, token } = (body as { url?: string, token?: string }) || {}

    if (!url || typeof url !== 'string') {
      throw new BusinessError('common.errors.invalidInput', 'Missing or invalid URL')
    }
    if (!token || typeof token !== 'string') {
      throw new BusinessError('common.errors.invalidInput', 'Missing or invalid token')
    }

    const verify = await verifyTurnstileToken(token)
    if (!verify) {
      throw new BusinessError('tools.douyinDownloader.errors.turnstileFailed', 'Cloudflare Turnstile verification failed')
    }

    if ((await reachedRateLimit(event, TOOLS.BILIBILI_DOWNLOADER))) {
      throw new BusinessError('common.errors.rateLimit', 'Rate limit exceeded')
    }

    const bilibiliPattern = /bilibili\.com|b23\.tv/i
    if (!bilibiliPattern.test(url)) {
      throw new BusinessError('tools.bilibiliDownloader.errors.invalidUrl', 'Invalid Bilibili URL')
    }

    // Using the explicit URL provided by the user for testing/cache
    const response = await $fetch<any>("https://cache.tikhub.io/api/v1/cache/public/9b158b38-c0a0-4350-8fa4-b075df3644ec?sign=937372f74110b65afff7d2390bbce93b7e79624bc1dbc2dd79e7914201ef758f", { method: 'GET' })

    // Extract data from response - handling the structure seen in logs
    const data = response?.data || response
    const code = response?.code || 200

    if (code !== 200 || !data) {
      throw new BusinessError('tools.bilibiliDownloader.errors.parseFailed', 'Failed to parse Bilibili video')
    }

    const dash = data.data.dash
    if (!dash || !dash.video) {
        throw new BusinessError('tools.bilibiliDownloader.errors.parseFailed', 'No video data found')
    }

    const video = []
    for (const item of dash.video) {
      video.push({
        downloadUrl: `https://api.easydown.org/api/proxy?url=${encodeURIComponent(item.base_url)}`,
        type: 1,
        width: item.width,
        height: item.height,
        mimeType: item.mimeType
      })
    }

    return sendSuccess({
      title: 'Untitled Video',
      videoInfo: {
        duration: dash.duration,
        urls: video
      }
    })
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }
    console.error('Bilibili parse error:', err)
    return sendApiError('tools.bilibiliDownloader.errors.parseFailed', 'Failed to parse video')
  }
})
