import { sendSuccess, sendApiError, BusinessError, type ApiResponse } from '../../utils/apiResponse'
import { TOOLS } from '../../utils/constants'
import { reachedRateLimit } from '../../utils/RateLimit'

interface VideoResult {
  title?: string
  downloadUrls: string[]
}


function parseItemId(url: string): string {
  const tmp = url.split('/')
  if (tmp.length === 0) {
    throw new BusinessError('tools.tiktokDownloader.errors.invalidUrl', 'Invalid TikTok URL')
  }
  const itemId = tmp[tmp.length - 1]
  if (!itemId) {
    throw new BusinessError('tools.tiktokDownloader.errors.invalidUrl', 'Invalid TikTok URL')
  }
  return itemId
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

    const itemId = parseItemId(url)

    const verify = await verifyTurnstileToken(token)
    if (!verify) {
      throw new BusinessError('tools.douyinDownloader.errors.turnstileFailed', 'Cloudflare Turnstile verification failed')
    }

    if ((await reachedRateLimit(event, TOOLS.TIKTOK_DOWNLOADER))) {
      throw new BusinessError('common.errors.rateLimit', 'Rate limit exceeded')
    }

    const tiktokPattern = /tiktok\.com|vmtiktok\.com/i
    if (!tiktokPattern.test(url)) {
      throw new BusinessError('tools.tiktokDownloader.errors.invalidUrl', 'Invalid TikTok URL')
    }

    const tikhubClient = new TikhubClient(process.env.NUXT_TIKHUB_TOKEN as string)
    const result = (await tikhubClient.fetchTiktokVideo(itemId)) as { code: number, data: any }

    if (result.code !== 200 || !result.data) {
      throw new BusinessError('tools.tiktokDownloader.errors.parseFailed', 'Failed to parse TikTok video')
    }

    const aweme_detail = result.data.aweme_detail
    const urlList = aweme_detail?.added_sound_music_info?.play_url?.url_list

    if (urlList.length === 0) {
      throw new BusinessError('tools.tiktokDownloader.errors.parseFailed', 'No download URLs found')
    }

    return sendSuccess({
      title: '',
      downloadUrls: urlList
    })
  }
  catch (err: unknown) {
    if (err instanceof BusinessError) {
      return sendApiError(err.errorKey, err.message)
    }
    console.error('TikTok parse error:', err)
    return sendApiError('tools.tiktokDownloader.errors.parseFailed', 'Failed to parse video')
  }
})
