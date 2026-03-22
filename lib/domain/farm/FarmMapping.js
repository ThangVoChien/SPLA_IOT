/**
 * FarmMapping - API client for field management
 * Implements IGroupMapping contract
 * Communicates with /api/domain/farm backend endpoints
 * Does NOT access database directly - delegates to API layer
 */

import { IGroupMapping } from '../../core/contracts.js';

export class FarmMapping extends IGroupMapping {
  /**
   * Fetch all fields for an organization
   */
  async getAllGroup() {
    const res = await fetch('/api/domain/farm');
    return res.json();
  }

  /**
   * Create a new field
   */
  async createGroup(data) {
    const res = await fetch('/api/domain/farm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        fieldCode: data.fieldCode,
        fieldName: data.fieldName,
        location: data.location,
        areaSize: data.areaSize,
        cropType: data.cropType,
        soilType: data.soilType
      })
    });
    return res.json();
  }

  /**
   * Update an existing field
   */
  async updateGroup(id, data) {
    const res = await fetch(`/api/domain/farm/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        fieldName: data.fieldName,
        location: data.location,
        areaSize: data.areaSize,
        cropType: data.cropType,
        soilType: data.soilType
      })
    });
    return res.json();
  }

  /**
   * Delete a field
   */
  async deleteGroup(id) {
    const res = await fetch(`/api/domain/farm/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  }

  /**
   * Get available devices (unassigned or assigned to specified field)
   */
  async getAvailableDevices(fieldId = null) {
    const url = fieldId
      ? `/api/domain/farm/devices?fieldId=${fieldId}`
      : '/api/domain/farm/devices';
    const res = await fetch(url);
    return res.json();
  }

  /**
   * Assign devices to a field
   */
  async assignDevices(fieldId, deviceIds) {
    const res = await fetch('/api/domain/farm', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fieldId, deviceIds, action: 'assign' })
    });
    return res.json();
  }

  /**
   * Unassign devices from a field
   */
  async unassignDevices(fieldId, deviceIds) {
    const res = await fetch('/api/domain/farm', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fieldId, deviceIds, action: 'unassign' })
    });
    return res.json();
  }
}
