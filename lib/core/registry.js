import { IDomainLogic, IDashboardWidget, IGroupSidebar, IGroupManager } from './contracts';

/**
 * SPLA Plug-and-Play Registry (Core Only)
 * Allows external domains to inject their specialized classes 
 * without core implementation dependencies.
 */
export const Registry = {
  /**
   * Plugs domain-specific specialized classes into the Core.
   */
  plug(logicClass, widgetClass, sidebarClass, groupManagerClass) {
    if (logicClass) {
      IDomainLogic.class = logicClass;
    }
    if (widgetClass) {
      IDashboardWidget.class = widgetClass;
    }
    if (sidebarClass) {
      IGroupSidebar.class = sidebarClass;
    }
    if (groupManagerClass) {
      IGroupManager.class = groupManagerClass;
    }
    console.log('[SPLA] Core Framework: Domain components plugged successfully.');
  }
};
