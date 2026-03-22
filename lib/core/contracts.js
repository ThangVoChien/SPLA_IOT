/**
 * IOT CORE SDK - Domain Variability Contracts (SPLA)
 * 
 * The Core SDK provides infrastructure. Domain Repositories (Farm, Hospital, etc.)
 * MUST implement these interfaces to inject their specific business logic into the Core.
 * This guarantees low coupling and adheres to SOLID (Dependency Inversion, Liskov Substitution).
 */


// ==========================================
// 1. DATA PROCESSING & NOTIFICATIONS
// ==========================================

export class IDomainLogic {
  static "class" = null;

  /**
   * Domain-specific action called after a threshold breach.
   * Useful for external automation (e.g., n8n webhooks).
   * @param {Object} device - The target device
   */
  async onAlert(device) {
    throw new Error('Method "onAlert" must be implemented.');
  }
}

// ==========================================
// 2. DASHBOARD & UI WIDGET COMPOSITION
// ==========================================

export class IDashboardWidget {
  static "class" = null;

  constructor(props) {
    this.props = props;
  }

  /**
   * Domain-specific render logic.
   * Return JSX/React elements to be displayed on the dashboard.
   */
  render() {
    throw new Error('Method "render" must be implemented.');
  }
}

// ==========================================
// 3. SIDEBAR & NAVIGATION EXTENSION
// ==========================================

export class IGroupSidebar {
  static "class" = null;

  /**
   * Defines the display label for the sidebar link.
   */
  getLabel() {
    throw new Error('Method "getLabel" must be implemented.');
  }

  /**
   * Defines the target URL for the sidebar link.
   */
  getHref() {
    throw new Error('Method "getHref" must be implemented.');
  }

  /**
   * Defines the Bootstrap Icon class for the sidebar link.
   * e.g., "bi-hospital", "bi-tree"
   */
  getIcon() {
    throw new Error('Method "getIcon" must be implemented.');
  }

  /**
   * Whether this navigation item is restricted to administrators.
   * Defaults to false for general domain entities.
   */
  isAdmin() {
    return false;
  }
}

// ==========================================
// 4. ENTITY GROUPING & HIERARCHY (MANAGERS)
// ==========================================

/**
 * Because a "Group" means different things (Farm -> Field vs. Hospital -> Patient),
 * this interface allows the domain to manage its own hierarchy and CRUD operations.
 */
export class IGroupManager {
  static "class" = null;

  /**
   * Returns a unified API client. 
   * The Core Dashboard calls this proxy to interact with domain logic.
   */
  getAPI() {
    return {
      getAllGroup: (params) => this.getAllGroup(params),
      createGroup: (data) => this.createGroup(data),
      updateGroup: (id, data) => this.updateGroup(id, data),
      deleteGroup: (id) => this.deleteGroup(id),
      getAvailableDevices: () => this.getAvailableDevices(),
      assignDevices: (groupId, ids) => this.assignDevices(groupId, ids),
      unassignDevices: (groupId, ids) => this.unassignDevices(groupId, ids)
    };
  }

  // --- Abstract Variability Points (Overriden by Domain Implementations) ---

  /** Fetch all organizational units (groups) for a specific level/parent. */
  async getAllGroup(params) { throw new Error('Method "getAllGroup" must be implemented.'); }

  /** Create a new organizational unit (group). */
  async createGroup(data) { throw new Error('Method "createGroup" must be implemented.'); }

  /** Update an existing organizational unit (group). */
  async updateGroup(id, data) { throw new Error('Method "updateGroup" must be implemented.'); }

  /** Remove an organizational unit (group). */
  async deleteGroup(id) { throw new Error('Method "deleteGroup" must be implemented.'); }

  /** Discovery: Get all unassigned devices in domain. */
  async getAvailableDevices() { throw new Error('Method "getAvailableDevices" must be implemented.'); }

  /** Linking: Assign devices to a cluster. */
  async assignDevices(groupId, deviceIds) { throw new Error('Method "assignDevices" must be implemented.'); }

  /** Unlinking: Remove devices from a cluster. */
  async unassignDevices(groupId, deviceIds) { throw new Error('Method "unassignDevices" must be implemented.'); }
}