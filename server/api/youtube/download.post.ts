import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { reachedRateLimit } from '../../utils/RateLimit'

interface VideoResult {
  video: {
    title?: string
    thumbnail?: {
      height: number
      url: string
      width: number
    }
    duration?: string
    downloadUrls: Array<{
      width: number
      height: number
      url: string
      type: number
      qualityLabel: string
    }>
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  } else {
    return `${m}:${s.toString().padStart(2, '0')}`
  }
}

function parseVideoId(url: string): string | null {
  const youtubePattern = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  const match = url.match(youtubePattern)
  return match?.[1] || null
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

    const vid = parseVideoId(url)
    if (!vid) {
      throw new BusinessError('tools.youtubeDownloader.errors.invalidUrl', 'Invalid YouTube URL')
    }

    const youtubePattern = /youtube\.com|youtu\.be/i
    if (!youtubePattern.test(url)) {
      throw new BusinessError('tools.youtubeDownloader.errors.invalidUrl', 'Invalid YouTube URL')
    }

    const tikhubClient = new TikhubClient(process.env.NUXT_TIKHUB_TOKEN as string)
    const result = (await tikhubClient.fetchYoutubeVideo(vid)) as { code: number, data: any }
    if (!result.data) {
      throw new BusinessError('tools.youtubeDownloader.errors.parseFailed', 'Failed to parse YouTube video')
    }
    const data = result.data

    const videoDetails = data.videoDetails
    const streamingData = data.streamingData
    const downloadUrls: Array<{
      width: number
      height: number
      url: string
      type: number
      qualityLabel: string
    }> = []
    const thumbnail = videoDetails?.thumbnail?.thumbnails.at(-1)
    const duration = videoDetails?.lengthSeconds ? formatDuration(Number(videoDetails.lengthSeconds)) : undefined

    streamingData.adaptiveFormats.forEach((f: any) => {
      const t = {
        width: f.width,
        height: f.height,
        url: f.url,
        type: 1,
        qualityLabel: f.qualityLabel
      }
      downloadUrls.push(t)
    })
    const video = {
      title: videoDetails.title,
      thumbnail: thumbnail,
      duration: duration,
      downloadUrls: downloadUrls
    }
    
    return sendSuccess({ video })
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }
    console.error('YouTube parse error:', err)
    return sendApiError('tools.youtubeDownloader.errors.parseFailed', 'Failed to parse video')
  }
})