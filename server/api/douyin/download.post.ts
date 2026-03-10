import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { checkRateLimit } from '../../utils/rateLimit'

interface DownloadItem {
  type: 'video' | 'audio'
  quality: string
  url: string
  cover: string
  size?: string
  duration?: string
}

interface DouyinVideoResult {
  title: string
  author: string
  avatar?: string
  items: DownloadItem[]
}

export default eventHandler(async (event): Promise<ApiResponse<DouyinVideoResult | null>> => {
  try {
    // Read request body
    const body = await readBody(event)
    const { url, token } = (body as { url?: string, token?: string }) || {}

    // Validate input
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

    if (!(await checkRateLimit(event, TOOLS.DOUYIN_DOWNLOADER))) {
      throw new BusinessError('common.errors.rateLimit', 'Rate limit exceeded')
    }

    // Validate Douyin URL pattern
    const douyinPattern = /douyin\.com|iesdouyin\.com|v\.douyin\.com/i
    if (!douyinPattern.test(url)) {
      throw new BusinessError('tools.douyinDownloader.errors.invalidUrl', 'Invalid Douyin URL')
    }

    const result = await parseDouyinVideo(url)
    return sendSuccess(result)
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }

    console.error('Douyin parse unknown error:', err)
    return sendApiError('tools.douyinDownloader.errors.parseFailed', 'Failed to parse video')
  }
})

async function parseDouyinVideo(_shareUrl: string): Promise<DouyinVideoResult> {
  return {
    title: 'Video parsing not yet implemented',
    author: 'ToolSpace',
    items: [
      {
        type: 'video',
        quality: 'HD',
        url: '',
        cover: ''
      },
      {
        type: 'audio',
        quality: 'MP3',
        url: '',
        cover: ''
      }
    ]
  }
}
