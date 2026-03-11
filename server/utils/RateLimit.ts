import type { H3Event } from 'h3'
import { db, schema } from '@nuxthub/db'
import {eq, and} from 'drizzle-orm'
import { TOOLS, type ToolName } from './constants'


/**
 * Default rate limits per tool (requests per day per IP)
 */
const TOOL_LIMITS: Record<ToolName, number> = {
  [TOOLS.DOUYIN_DOWNLOADER]: 3,
  [TOOLS.TIKTOK_DOWNLOADER]: 3,
  [TOOLS.YOUTUBE_DOWNLOADER]: 1,
  [TOOLS.BILIBILI_DOWNLOADER]: 100000,
  [TOOLS.RED_DOWNLOADER]: 1
}

/** Default limit if tool is not in the config */
const DEFAULT_LIMIT = 1

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
export async function reachedRateLimit(event: H3Event, toolName: ToolName): Promise<boolean> {
  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const today = getTodayDate()
  const maxRequests = TOOL_LIMITS[toolName] || DEFAULT_LIMIT
  // Find existing record
  const row = await db.select({
    total: schema.rate_limits.count
  }).from(schema.rate_limits).where(and(
    eq(schema.rate_limits.ip, ip),
    eq(schema.rate_limits.sync_date, today)
  )).limit(1)

  if (row.length == 0) {
    await db.insert(schema.rate_limits).values({
      ip,
      sync_date: today,
      tool: toolName,
      count: 1,
      createdAt: (new Date())
    })
    return false
  }
  else {
    if (row[0].total >= maxRequests) {
      return true
    }
    await db.update(schema.rate_limits).set({
      count: row[0].total + 1
    }).where(and(
      eq(schema.rate_limits.ip, ip),
      eq(schema.rate_limits.sync_date, today),
      eq(schema.rate_limits.tool, toolName)
    ))
    return false
  }
}
