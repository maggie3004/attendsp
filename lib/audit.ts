/**
 * Audit Log Service
 * Every sensitive action is recorded with actor, before/after values, IP
 * These records are immutable — no update or delete allowed
 */

import { prisma } from './db'
import type { AuditAction } from '@prisma/client'

export interface CreateAuditLogParams {
  actorId?: string
  targetUserId?: string
  action: AuditAction
  targetTable: string
  targetId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  reason?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
}

export async function createAuditLog(
  params: CreateAuditLogParams
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        targetUserId: params.targetUserId,
        action: params.action,
        targetTable: params.targetTable,
        targetId: params.targetId,
        oldValues: params.oldValues ?? undefined,
        newValues: params.newValues ?? undefined,
        reason: params.reason,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        metadata: params.metadata ?? undefined,
      },
    })
  } catch (error) {
    // Audit log failure should never crash the main operation
    console.error('[AuditLog] Failed to create audit log:', error)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0] ?? realIp ?? 'unknown'
}
