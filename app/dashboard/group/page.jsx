'use client'

import React, { useEffect, useState } from 'react';
import GroupDashboard from '@/components/core/GroupDashboard';
import { Registry } from '@/lib/core/registry';
import { IGroupManager, IGroupSidebar } from '@/lib/core/contracts';

/**
 * MOCK Implementation for UI Demonstration
 */
class DemoGroupManager extends IGroupManager {
  // --- Implementation of Abstract Variability Points ---

  async getAllGroup({ level, parentId }) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 101, name: "Intensive Care Unit (ICU)", description: "High-priority patient monitoring with specialized sensors and dual redundancy.", devices: [{ id: 1, name: 'S600 Ventilator' }] },
          { id: 102, name: "Operating Theater A", description: "Real-time sterile environment, specialized surgical equipment, and workflow tracking.", devices: [] },
          { id: 103, name: "Radiology & Imaging", description: "High-bandwidth data management for CT, MRI, and specialized diagnostic systems.", devices: [] },
          { id: 104, name: "Pediatrics Ward", description: "Secured environment with specialized monitoring for neonatal and pediatric patients.", devices: [] },
          { id: 105, name: "Medical Laboratory", description: "Automated sample analysis, chemical stability, and inventory temperature tracking.", devices: [] },
          { id: 106, name: "Emergency Care", description: "Immediate response monitoring for triage and stabilization units.", devices: [] }
        ]);
      }, 800);
    });
  }

  async createGroup(data) {
    console.log("[SPLA DEMO] CREATE Domain Entity:", data);
    return { success: true };
  }

  async updateGroup(id, data) {
    console.log("[SPLA DEMO] UPDATE Domain Entity:", id, data);
    return { success: true };
  }

  async deleteGroup(id) {
    console.log("[SPLA DEMO] DELETE Domain Entity:", id);
    return { success: true };
  }

  async getAvailableDevices() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 'dev-1', name: "Patient Monitor-MX", macAddress: "00:1A:2B:3C:4D:5E" },
          { id: 'dev-2', name: "Smart Infusion Pump-V3", macAddress: "A1:B2:C3:D4:E5:F6" },
          { id: 'dev-3', name: "S600 Ventilator (Unlinked)", macAddress: "DE:AD:BE:EF:00:12" },
          { id: 'dev-4', name: "Point-of-Care Hub", macAddress: "FE:DC:BA:98:76:54" },
          { id: 'dev-5', name: "Critical Alert Gateway", macAddress: "11:22:33:44:55:66" }
        ]);
      }, 600);
    });
  }

  async assignDevices(groupId, deviceIds) {
    return new Promise(resolve => {
      console.log(`[SPLA DEMO] Assigning ${deviceIds.length} nodes to cluster ${groupId}`);
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  }

  async unassignDevices(groupId, deviceIds) {
    return new Promise(resolve => {
      console.log(`[SPLA DEMO] Unlinking ${deviceIds.length} nodes from cluster ${groupId}`);
      setTimeout(() => {
        resolve({ success: true });
      }, 800);
    });
  }
}

class DemoSidebar extends IGroupSidebar {
  getLabel() { return "Hospital Fleet"; }
  getHref() { return "/dashboard/group"; }
  getIcon() { return "bi-h-square-fill"; }
}

export default function GroupDemoPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // [SPLA Injection]: Temporarily plug the demo components for this preview
    // In a real app, this would be done by the domain repository on initialization
    Registry.plug(null, null, DemoSidebar, DemoGroupManager);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container-fluid min-vh-100 p-0">
      <GroupDashboard
        title="Hospital Fleet Management"
        description="Operational overview of medical facilities and patient care clusters."
        icon="bi-h-square-fill"
        addLabel="Add Ward"
        cardActionLabel="Enter Ward Dashboard"
      />
    </div>
  );
}
