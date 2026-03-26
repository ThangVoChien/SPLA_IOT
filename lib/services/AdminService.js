import { prisma } from '../db/prisma';
import { AuditService } from './AuditService';
import bcrypt from 'bcryptjs';

/**
 * Singleton Service for Global Administrative Operations.
 * Centralizes business logic for Users, Organizations, and Devices.
 */
export class AdminService {
  
  // --- USER MANAGEMENT ---

  static async addUser(data) {
    const orgName = String(data.orgName ?? '').trim();
    const username = String(data.username ?? '').trim();
    const password = String(data.password ?? '');

    if (!orgName) throw new Error('Organization name is required');
    if (!username) throw new Error('Username is required');
    if (!password) throw new Error('Password is required');

    const hashedPassword = await bcrypt.hash(password, 10);
    const org = await prisma.organization.upsert({
      where: { name: orgName },
      update: {},
      create: { name: orgName }
    });

    try {
      const user = await prisma.user.create({
        data: {
          orgId: org.id,
          username,
          passwordHash: hashedPassword,
          role: 'USER'
        }
      });
      // Audit
      AuditService.logAction('SYSTEM', 'ADD_USER', { username, org: orgName }).catch(console.error);
      return user;
    } catch (error) {
      if (error.code === 'P2002') throw new Error('Username already exists globally');
      throw new Error('Failed to create user');
    }
  }

  static async updateUser(userId, data) {
    const updateData = { username: data.username };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    AuditService.logAction('SYSTEM', 'UPDATE_USER', { userId, username: data.username }).catch(console.error);
    return user;
  }

  static async deleteUser(userId, requesterId) {
    if (userId === requesterId) throw new Error('Self-deletion prohibited');
    const result = await prisma.user.delete({
      where: { id: userId }
    });
    AuditService.logAction(requesterId, 'DELETE_USER', { userId }).catch(console.error);
    return result;
  }

  static async changeUserRole(userId, newRole, requesterId) {
    if (userId === requesterId && newRole !== 'ADMIN') throw new Error('Self-downgrade prohibited');
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    AuditService.logAction(requesterId, 'CHANGE_ROLE', { userId, newRole }).catch(console.error);
    return user;
  }

  // --- ORGANIZATION MANAGEMENT ---

  static async createOrg(name) {
    const org = await prisma.organization.create({
      data: { name }
    });
    AuditService.logAction('SYSTEM', 'CREATE_ORG', { name }).catch(console.error);
    return org;
  }

  static async updateOrg(orgId, name) {
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { name }
    });
    AuditService.logAction('SYSTEM', 'UPDATE_ORG', { orgId, name }).catch(console.error);
    return org;
  }

  static async deleteOrg(orgId, requesterOrgId) {
    if (orgId === requesterOrgId) {
      throw new Error('Self-organization deletion prohibited');
    }
    const result = await prisma.organization.delete({
      where: { id: orgId }
    });
    AuditService.logAction('SYSTEM', 'DELETE_ORG', { orgId }).catch(console.error);
    return result;
  }

  // --- SENSOR DOMAIN MANAGEMENT ---

  static async createSensor(data) {
    const sensorType = String(data.sensorType ?? data.name ?? '').trim();
    const unit = String(data.unit ?? '').trim();
    const dataType = String(data.dataType ?? 'FLOAT').trim() || 'FLOAT';
    const alertTemplate = String(data.alertTemplate ?? '');

    if (!sensorType) {
      throw new Error('sensorType is required');
    }

    if (!unit) {
      throw new Error('unit is required');
    }

    const sensor = await prisma.sensor.create({
      data: {
        sensorType,
        unit,
        dataType,
        alertTemplate
      }
    });
    AuditService.logAction('SYSTEM', 'CREATE_SENSOR', { sensorType, unit }).catch(console.error);
    return sensor;
  }

  static async updateSensor(sensorId, data) {
    const sensor = await prisma.sensor.update({
      where: { id: sensorId },
      data: {
        sensorType: data.sensorType || undefined,
        unit: data.unit || undefined,
        dataType: data.dataType || undefined,
        alertTemplate: data.alertTemplate ?? ''
      }
    });
    AuditService.logAction('SYSTEM', 'UPDATE_SENSOR', { sensorId, sensorType: data.sensorType }).catch(console.error);
    return sensor;
  }

  static async deleteSensor(sensorId) {
    const result = await prisma.sensor.delete({
      where: { id: sensorId }
    });
    AuditService.logAction('SYSTEM', 'DELETE_SENSOR', { sensorId }).catch(console.error);
    return result;
  }
}
