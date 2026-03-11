/**
 * Tool identifier constants
 */
export const TOOLS = {
  DOUYIN_DOWNLOADER: 'douyin-downloader',
  TIKTOK_DOWNLOADER: 'tiktok-downloader',
  YOUTUBE_DOWNLOADER: 'youtube-downloader',
  BILIBILI_DOWNLOADER: 'bilibili-downloader',
  RED_DOWNLOADER: 'red-downloader'
} as const

/**
 * Type for tool names based on the TOOLS constant
 */
export type ToolName = typeof TOOLS[keyof typeof TOOLS]
