/**
 * TikhubClient - A client for interacting with tikhub.io API
 *
 * Documentation: https://api.tikhub.io/
 */
export class TikhubClient {
  private baseUrl: string = 'https://api.tikhub.io'
  private token: string

  constructor(token: string) {
    if (!token) {
      console.warn('TikhubClient: Token is missing. API calls will likely fail.')
    }
    this.token = token
  }

  /**
   * Generic request helper
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    try {
      const response = await $fetch<T>(url, {
        ...options,
        method: options.method as 'GET' | 'POST',
        headers
      })
      return response as T
    }
    catch (error: unknown) {
      const err = error as { data?: unknown, message?: string }
      console.error(`Tikhub API Error (${endpoint}):`, err.data || err.message || error)
      throw error
    }
  }

  /**
   * Douyin: Fetch one video by share URL
   * @param shareUrl The share URL from Douyin (e.g., https://v.douyin.com/xxxx/)
   */
  async fetchOneVideoByShareUrl(shareUrl: string) {
    const endpoint = `/api/v1/douyin/web/fetch_one_video_by_share_url?share_url=${encodeURIComponent(shareUrl)}`
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * TikTok: Fetch video by share URL
   */
  async fetchTiktokVideo(itemId: string) {
    const endpoint = `/api/v1/tiktok/app/v3/fetch_one_video?aweme_id=${itemId}`
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * YouTube: Fetch video by URL
   */
  async fetchYoutubeVideo(videoId: string) {
    const endpoint = `/api/v1/youtube/web/get_video_info_v2?video_id=${videoId}`
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * Bilibili: Fetch video by URL
   */
  async fetchBilibiliVideo(url: string) {
    const endpoint = `/api/v1/bilibili/web/fetch_video_play_info?url=${encodeURIComponent(url)}`
    return this.request(endpoint, { method: 'GET' })
  }

  /**
   * Xiaohongshu (Red): Fetch note by share URL
   */
  async fetchRedNote(shareUrl: string) {
    const endpoint = `/api/v1/xiaohongshu/web/fetch_one_note_by_share_url?share_url=${encodeURIComponent(shareUrl)}`
    return this.request(endpoint, { method: 'GET' })
  }
}
