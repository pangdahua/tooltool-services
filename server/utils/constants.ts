/**
 * Tool identifier constants
 */
export const TOOLS = {
  DOUYIN_DOWNLOADER: 'douyin-downloader'
} as const

/**
 * Type for tool names based on the TOOLS constant
 */
export type ToolName = typeof TOOLS[keyof typeof TOOLS]
