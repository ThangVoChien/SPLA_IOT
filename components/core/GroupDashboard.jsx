'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { IGroupManager } from '@/lib/core/contracts';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import AddGroupForm from './AddGroupForm';
import GroupCard from './GroupCard';
import DeviceSelectionList from './DeviceSelectionList';

/**
 * SPLA Core Component: GroupDashboard
 * 
 * A standardized functional component for entity management.
 * Domain product lines pass parameters to customize title, icons, and labels
 * without needing to extend a class.
 */
export default function GroupDashboard({
  title = "Organization Fleet",
  description = "View and manage your domain-specific clusters and entity hierarchies.",
  icon = "bi-folder2-open",
  emptyMessage = "No clusters identified in this domain yet.",
  addLabel = "New Cluster",
  cardActionLabel = "Manage Collection",
  level = 0,
  parentId = null
}) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State Logic
  const [activeModal, setActiveModal] = useState(null); // 'ADD' | 'EDIT' | 'DELETE' | 'ASSIGN'
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  // Device Selection State
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Late binding of the plugged Manager Class from the SPLA Registry
  const ManagerClass = IGroupManager.class;

  const fetchData = useCallback(() => {
    // Late binding of the plugged Manager Class from the SPLA Registry
    const PluggedClass = IGroupManager.class;

    if (PluggedClass) {
      console.log("[SPLA-DASHBOARD] Resolving Manager Class:", PluggedClass.name);
      const manager = new PluggedClass();
      setLoading(true);

      // Map to generic getAllGroup request
      manager.getAPI().getAllGroup({ level, parentId })
        .then(data => {
          console.log("[SPLA-DASHBOARD] Synchronized Items:", (data || []).length);
          setGroups(Array.isArray(data) ? data : []);
        })
        .catch(err => console.error("SPLA-DASHBOARD: Sync failed", err))
        .finally(() => setLoading(false));
    } else {
      console.warn("[SPLA-DASHBOARD] Waiting for Domain Registration...");
      setLoading(false);
    }
  }, [level, parentId, IGroupManager.class]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchAvailableDevices = async () => {
    if (!ManagerClass) return;
    setLoadingDevices(true);
    try {
      const manager = new ManagerClass();
      const data = await manager.getAPI().getAvailableDevices();
      setAvailableDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load available devices", err);
    } finally {
      setLoadingDevices(false);
    }
  };

  const closeModals = () => {
    setActiveModal(null);
    setSelectedGroup(null);
    setFormData({ name: '', description: '' });
    setSelectedDeviceIds([]);
    setAvailableDevices([]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!ManagerClass) return;
    setIsSubmitting(true);
    try {
      const manager = new ManagerClass();
      // Map to descriptive createGroup request
      await manager.getAPI().createGroup({ ...formData, level, parentId });
      closeModals();
      fetchData();
    } catch (err) {
      console.error("Create failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!ManagerClass || !selectedGroup) return;
    setIsSubmitting(true);
    try {
      const manager = new ManagerClass();
      // Map to descriptive updateGroup request
      await manager.getAPI().updateGroup(selectedGroup.id, formData);
      closeModals();
      fetchData();
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!ManagerClass || !selectedGroup) return;
    setIsSubmitting(true);
    try {
      const manager = new ManagerClass();
      // Map to descriptive deleteGroup request
      await manager.getAPI().deleteGroup(selectedGroup.id);
      closeModals();
      fetchData();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!ManagerClass || !selectedGroup || selectedDeviceIds.length === 0) return;
    setIsSubmitting(true);
    try {
      const manager = new ManagerClass();
      await manager.getAPI().assignDevices(selectedGroup.id, selectedDeviceIds);
      closeModals();
      fetchData();
    } catch (err) {
      console.error("Assignment failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDeviceSelection = (id) => {
    setSelectedDeviceIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in py-2">
      {/* Dashboard Header: Premium Glassmorphism Look */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4 mb-5 p-5 glass-panel">
        <div className="flex-grow-1">
          <h1 className="display-5 fw-bold mb-2 tracking-tight text-white">{title}</h1>
          <p className="text-muted mb-0 d-flex align-items-center gap-2 lead opacity-75">
            <i className="bi bi-info-circle-fill text-primary"></i>
            {description}
          </p>
        </div>
        <div className="d-flex gap-3">
          <button
            onClick={() => setActiveModal('ADD')}
            className="btn btn-primary d-flex align-items-center gap-3 px-4 py-3 shadow-lg transition-all rounded-4"
          >
            <i className="bi bi-plus-circle fs-5"></i>
            <span className="fw-bold fs-5">{addLabel}</span>
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="mb-4 d-flex justify-content-between align-items-center px-1">
        <div className="position-relative" style={{ width: '360px' }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
          <input
            type="text"
            className="form-control ps-5 py-3 rounded-4 border-0 bg-dark bg-opacity-25 shadow-inner"
            placeholder="Filter by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-muted small fw-semibold tracking-widest text-uppercase opacity-50">
          Total {filteredGroups.length} Items Found
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 opacity-50 my-5">
          <div className="spinner-grow text-primary mb-4" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <span className="tracking-widest text-uppercase fw-bold small">Synchronizing Domain Hierarchy...</span>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-5 glass-panel border-dashed border-opacity-10 my-5">
          <div className="p-4 rounded-circle bg-dark bg-opacity-10 d-inline-block mb-3">
            <i className="bi bi-folder-x fs-1 opacity-25"></i>
          </div>
          <p className="text-muted fw-bold mb-0 fs-5">{emptyMessage}</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {filteredGroups.map(group => (
            <div key={group.id} className="col-12 col-md-6 col-xl-4">
              <GroupCard
                group={group}
                icon={icon}
                onEdit={() => {
                  setSelectedGroup(group);
                  setFormData({ name: group.name, description: group.description || '' });
                  setActiveModal('EDIT');
                }}
                onDelete={() => {
                  setSelectedGroup(group);
                  setActiveModal('DELETE');
                }}
                onAssign={() => {
                  setSelectedGroup(group);
                  fetchAvailableDevices();
                  setActiveModal('ASSIGN');
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={activeModal === 'ADD' || activeModal === 'EDIT'}
        onClose={closeModals}
        title={activeModal === 'ADD' ? `Create ${addLabel}` : `Edit ${selectedGroup?.name}`}
      >
        <AddGroupForm
          activeModal={activeModal}
          addLabel={addLabel}
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onSubmit={activeModal === 'ADD' ? handleCreate : handleEdit}
          onCancel={closeModals}
        />
      </Modal>

      {/* Assign Modal (Refactored for Multi-Select) */}
      <Modal
        isOpen={activeModal === 'ASSIGN'}
        onClose={closeModals}
        title={`Assign Nodes to ${selectedGroup?.name}`}
      >
        <form onSubmit={handleAssign}>
          <div className="mb-3 text-center">
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 d-inline-block mb-3">
              <i className="bi bi-cpu fs-2 text-primary"></i>
            </div>
            <p className="text-muted small">Select one or more available devices to link to this organizational cluster.</p>
          </div>

          <DeviceSelectionList
            loading={loadingDevices}
            devices={availableDevices}
            selectedIds={selectedDeviceIds}
            onToggle={toggleDeviceSelection}
          />

          <div className="d-flex justify-content-between align-items-center mt-4">
            <span className="small fw-bold text-primary opacity-75">
              {selectedDeviceIds.length} Nodes Selected
            </span>
            <div className="d-flex gap-2">
              <button type="button" onClick={closeModals} className="btn btn-outline-light border-0 opacity-50 btn-cancel-hover">Cancel</button>
              <button
                type="submit"
                disabled={isSubmitting || selectedDeviceIds.length === 0}
                className="btn btn-primary px-4 fw-bold shadow-lg"
              >
                {isSubmitting ? 'Linking...' : 'Assign Nodes'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={activeModal === 'DELETE'}
        onClose={closeModals}
        onConfirm={handleDelete}
        title="Unlink Domain Entity"
        message={`Are you sure you want to remove '${selectedGroup?.name}'?\nThis will disconnect all linked devices from this cluster.`}
      />
    </div>
  );
}
