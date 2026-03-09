import type { H3Event } from 'h3'
import { TOOLS, type ToolName } from './constants'

/**
 * Default rate limits per tool (requests per day per IP)
 */
const TOOL_LIMITS: Record<ToolName, number> = {
  [TOOLS.DOUYIN_DOWNLOADER]: 20
}

/** Default limit if tool is not in the config */
const DEFAULT_LIMIT = 10

/**
 * Get today's date string in YYYY-MM-DD format (UTC)
 */
function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Check and increment rate limit for a given tool and IP.
 * Throws a 429 error if the limit is exceeded.
 *
 * @param event - H3 event
 * @param toolName - Tool identifier
 */
export async function checkRateLimit(event: H3Event, toolName: ToolName): Promise<void> {
  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const today = getTodayDate()
  const maxRequests = TOOL_LIMITS[toolName] ?? DEFAULT_LIMIT

  const db = hubDatabase()

  // Find existing record
  const existing = await db
    .prepare('SELECT id, count FROM rate_limits WHERE ip = ? AND tool = ? AND date = ?')
    .bind(ip, toolName, today)
    .first()

  if (existing) {
    if ((existing as any).count >= maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: `Rate limit exceeded. Maximum ${maxRequests} requests per day for this tool.`
      })
    }

    // Increment counter
    await db
      .prepare('UPDATE rate_limits SET count = count + 1, updated_at = ? WHERE id = ?')
      .bind(Date.now(), (existing as any).id)
      .run()
  }
  else {
    // Insert new record
    await db
      .prepare('INSERT INTO rate_limits (ip, tool, date, count, updated_at) VALUES (?, ?, ?, 1, ?)')
      .bind(ip, toolName, today, Date.now())
      .run()
  }
}
