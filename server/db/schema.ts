import * as t from 'drizzle-orm/sqlite-core'
import { sqliteTable as table } from 'drizzle-orm/sqlite-core'

export const rate_limits = table('rate_limits', {
  id: t.integer('id').primaryKey({ autoIncrement: true }),
  ip: t.text('ip').notNull(),
  sync_date: t.text('sync_date').notNull(),
  tool: t.text('tool').notNull(),
  count: t.integer('count').notNull(),
  createdAt: t.integer('created_at', { mode: 'timestamp' }).notNull()
}, (table) => {
  return {
    ipIndex: t.index('idx_ip_sync_date').on(table.ip, table.sync_date)
  }
})
