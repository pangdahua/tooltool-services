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

    if ((await reachedRateLimit(event, TOOLS.YOUTUBE_DOWNLOADER))) {
      throw new BusinessError('common.errors.rateLimit', 'Rate limit exceeded')
    }

    const youtubePattern = /youtube\.com|youtu\.be/i
    if (!youtubePattern.test(url)) {
      throw new BusinessError('tools.youtubeDownloader.errors.invalidUrl', 'Invalid YouTube URL')
    }

    const tikhubClient = new TikhubClient(process.env.NUXT_TIKHUB_TOKEN as string)
    const result = (await tikhubClient.fetchYoutubeVideo(url)) as { code: number, data: any }

    if (result.code !== 200 || !result.data) {
      throw new BusinessError('tools.youtubeDownloader.errors.parseFailed', 'Failed to parse YouTube video')
    }

    // Tikhub YouTube response structure might differ, assuming typical HD/MP4 formats
    // Based on Tikhub docs info usually it's in data.formats
    const formats = (result.data.formats || []) as any[]
    const downloadUrls = formats.filter(f => f.url).map(f => f.url)

    if (downloadUrls.length === 0) {
      throw new BusinessError('tools.youtubeDownloader.errors.parseFailed', 'No download URLs found')
    }

    return sendSuccess({
      title: result.data.title,
      downloadUrls
    })
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }
    console.error('YouTube parse error:', err)
    return sendApiError('tools.youtubeDownloader.errors.parseFailed', 'Failed to parse video')
  }
})
