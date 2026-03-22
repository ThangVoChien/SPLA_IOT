import { IGroupMapping } from '../../core/contracts.js';

/**
 * FactoryMapping
 * Specialized interface for industrial hierarchy management.
 * Maps Factory units (Areas/Lines) to the platform's core organization model.
 */
export class FactoryMapping extends IGroupMapping {
  async getAllGroup() {
    const res = await fetch('/api/domain/factory');
    return res.json();
  }

  async createGroup(data) {
    const res = await fetch('/api/domain/factory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: data.name,
        description: data.description 
      })
    });
    return res.json();
  }

  async updateGroup(id, data) {
    const res = await fetch(`/api/domain/factory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: data.name,
        description: data.description 
      })
    });
    return res.json();
  }

  async deleteGroup(id) {
    const res = await fetch(`/api/domain/factory/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }

  async getAvailableDevices(groupId = null) {
    const url = groupId 
      ? `/api/domain/factory/devices?groupId=${groupId}`
      : '/api/domain/factory/devices';
    const res = await fetch(url);
    return res.json();
  }

  async assignDevices(groupId, deviceIds) {
    const res = await fetch('/api/domain/factory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId, deviceIds, action: 'assign' })
    });
    return res.json();
  }

  async unassignDevices(groupId, deviceIds) {
    const res = await fetch('/api/domain/factory', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId, deviceIds, action: 'unassign' })
    });
    return res.json();
  }
}
