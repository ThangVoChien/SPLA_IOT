import { prisma } from '../db/prisma';
import { AuditService } from './AuditService';

/**
 * Service Layer for User-level Device & Threshold Operations.
 * All queries are org-scoped for multi-tenant isolation.
 */
export class DeviceService {

  static async getDevicesByOrg(orgId) {
    return prisma.device.findMany({
      where: { orgId },
      include: {
        sensor: true,
        threshold: true
      },
      orderBy: { name: 'asc' }
    });
  }

  static async createDevice(orgId, userId, data) {
    const device = await prisma.device.create({
      data: {
        orgId,
        sensorId: data.sensorId,
        name: data.name,
        macAddress: data.macAddress,
        status: 'OFFLINE'
      }
    });

    if (data.operator && data.thresholdValue !== undefined && data.thresholdValue !== null && data.thresholdValue !== '') {
      await prisma.threshold.create({
        data: {
          deviceId: device.id,
          operator: data.operator,
          thresholdValue: parseFloat(data.thresholdValue)
        }
      });
    }

    AuditService.logAction(userId, 'CREATE_DEVICE', { name: data.name, macAddress: data.macAddress }).catch(console.error);

    // Notify stats change
    import('../core/event-bus.js').then(({ globalEventBus }) => {
      globalEventBus.emit('stats_update', { orgId });
    });

    return device;
  }

  static async updateDevice(deviceId, orgId, userId, data) {
    // Verify ownership
    const existing = await prisma.device.findFirst({ where: { id: deviceId, orgId } });
    if (!existing) throw new Error('Device not found or access denied');

    const device = await prisma.device.update({
      where: { id: deviceId },
      data: {
        name: data.name || undefined,
        macAddress: data.macAddress || undefined,
        sensorId: data.sensorId || undefined
      }
    });
    AuditService.logAction(userId, 'UPDATE_DEVICE', { deviceId, name: data.name }).catch(console.error);
    return device;
  }

  static async deleteDevice(deviceId, orgId, userId) {
    const existing = await prisma.device.findFirst({ where: { id: deviceId, orgId } });
    if (!existing) throw new Error('Device not found or access denied');

    const result = await prisma.device.delete({ where: { id: deviceId } });
    AuditService.logAction(userId, 'DELETE_DEVICE', { deviceId, name: existing.name }).catch(console.error);

    // Notify stats change
    import('@/lib/core/event-bus').then(({ globalEventBus }) => {
      globalEventBus.emit('stats_update', { orgId });
    });

    return result;
  }

  // --- THRESHOLD ---

  static async setThreshold(deviceId, orgId, userId, data) {
    const existing = await prisma.device.findFirst({ where: { id: deviceId, orgId } });
    if (!existing) throw new Error('Device not found or access denied');

    const threshold = await prisma.threshold.upsert({
      where: { deviceId },
      update: {
        operator: data.operator,
        thresholdValue: parseFloat(data.thresholdValue)
      },
      create: {
        deviceId,
        operator: data.operator,
        thresholdValue: parseFloat(data.thresholdValue)
      }
    });
    AuditService.logAction(userId, 'SET_THRESHOLD', { deviceId, operator: data.operator, value: data.thresholdValue }).catch(console.error);
    return threshold;
  }

  static async deleteThreshold(deviceId, orgId, userId) {
    const existing = await prisma.device.findFirst({ where: { id: deviceId, orgId } });
    if (!existing) throw new Error('Device not found or access denied');

    const threshold = await prisma.threshold.findUnique({ where: { deviceId } });
    if (!threshold) throw new Error('No threshold configured for this device');

    const result = await prisma.threshold.delete({ where: { deviceId } });
    AuditService.logAction(userId, 'DELETE_THRESHOLD', { deviceId }).catch(console.error);
    return result;
  }
}
