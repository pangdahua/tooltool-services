import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { reachedRateLimit } from '../../utils/RateLimit'

interface VideoResult {
  title?: string
  downloadUrls: string[]
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

    if ((await reachedRateLimit(event, TOOLS.RED_DOWNLOADER))) {
      throw new BusinessError('common.errors.rateLimit', 'Rate limit exceeded')
    }

    const redPattern = /xiaohongshu\.com|xhslink\.com/i
    if (!redPattern.test(url)) {
      throw new BusinessError('tools.redDownloader.errors.invalidUrl', 'Invalid Xiaohongshu URL')
    }

    const tikhubClient = new TikhubClient(process.env.NUXT_TIKHUB_TOKEN as string)
    const result = (await tikhubClient.fetchRedNote(url)) as { code: number, data: any }

    if (result.code !== 200 || !result.data) {
      throw new BusinessError('tools.redDownloader.errors.parseFailed', 'Failed to parse Xiaohongshu note')
    }

    // Xiaohongshu could be images or video
    const detail = result.data.note_detail || result.data
    const downloadUrls: string[] = []

    if (detail.video) {
      const urlList = (detail.video.download_addr?.url_list || []) as string[]
      downloadUrls.push(...urlList)
    }
    else if (detail.image_list) {
      const imageUrls = (detail.image_list as any[]).map(img => img.url_list?.[0] || img.url).filter(Boolean) as string[]
      downloadUrls.push(...imageUrls)
    }

    if (downloadUrls.length === 0) {
      throw new BusinessError('tools.redDownloader.errors.parseFailed', 'No download URLs found')
    }

    return sendSuccess({
      title: detail.title || detail.desc,
      downloadUrls
    })
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }
    console.error('Red parse error:', err)
    return sendApiError('tools.redDownloader.errors.parseFailed', 'Failed to parse note')
  }
})
