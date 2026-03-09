import { TOOLS } from '../../utils/constants'

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

export default defineEventHandler(async (event) => {
  const body = await readBody<{ url: string, token: string }>(event)
  const { url, token } = body || {}

  if (!url || typeof url !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid URL'
    })
  }

  if (!token || typeof token !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing Turnstile token'
    })
  }

  const verified = await verifyTurnstileToken(token)
  if (!verified.success) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Turnstile verification failed'
    })
  }

  await checkRateLimit(event, TOOLS.DOUYIN_DOWNLOADER)

  const douyinPattern = /douyin\.com|iesdouyin\.com|v\.douyin\.com/i
  if (!douyinPattern.test(url)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Douyin URL'
    })
  }

  try {
    const result = await parseDouyinVideo(url)
    return result
  }
  catch (err: any) {
    console.error('Douyin parse error:', err)
    throw createError({
      statusCode: 422,
      statusMessage: 'Failed to parse video'
    })
  }
})

async function parseDouyinVideo(shareUrl: string): Promise<DouyinVideoResult> {
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
