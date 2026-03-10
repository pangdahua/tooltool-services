import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { reachedRateLimit } from '../../utils/RateLimit'


interface DouyinVideoResult {
  title?: string
  downloadUrls: string[]
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

    if ((await reachedRateLimit(event, TOOLS.DOUYIN_DOWNLOADER))) {
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

interface TikhubResponse {
  code: number
  data: {
    aweme_detail: {
      preview_title?: string
      desc?: string
      video?: {
        download_addr: {
          url_list: string[]
        }
      }
      author?: {
        nickname: string
        avatar_thumb?: {
          url_list: string[]
        }
      }
    }
  }
}

async function parseDouyinVideo(_shareUrl: string): Promise<DouyinVideoResult> {
  const tikhubClient = new TikhubClient(process.env.NUXT_TIKHUB_TOKEN as string)
  const result = await tikhubClient.fetchOneVideoByShareUrl(_shareUrl) as TikhubResponse

  const { code, data } = result
  if (code !== 200 || !data) {
    throw new BusinessError('tools.douyinDownloader.errors.parseFailed', 'Failed to parse Douyin video: API error')
  }

  const detail = data.aweme_detail
  if (!detail) {
    throw new BusinessError('tools.douyinDownloader.errors.parseFailed', 'Failed to parse Douyin video: No detail found')
  }

  const urlList = (detail.video?.download_addr?.url_list || []) as string[]
  if (urlList.length === 0) {
    throw new BusinessError('tools.douyinDownloader.errors.parseFailed', 'Failed to parse Douyin video: No download URLs found')
  }

  return {
    title: detail.preview_title || detail.desc,
    downloadUrls: urlList
  }
}
