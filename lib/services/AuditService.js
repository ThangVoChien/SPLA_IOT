import { prisma } from '../db/prisma';

export class AuditService {
  /**
   * Logs an action into the system
   */
  static async logAction(userId, action, details) {
    try {
      await prisma.log.create({
        data: {
          userId,
          action,
          details: typeof details === 'string' ? details : JSON.stringify(details),
        },
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}
