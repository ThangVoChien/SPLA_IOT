import { IDomainLogic, IDashboardWidget, IGroupSidebar, IGroupMapping } from './contracts.js';

/**
 * SPLA Plug-and-Play Registry (Core Only)
 * Allows external domains to inject their specialized classes 
 * without core implementation dependencies.
 */
export const Registry = {
  /**
   * Plugs domain-specific specialized classes into the Core.
   */
  plug(logicClass, widgetClass, sidebarClass, groupMappingClass) {
    if (logicClass) {
      IDomainLogic.class = logicClass;
    }
    if (widgetClass) {
      IDashboardWidget.class = widgetClass;
    }
    if (sidebarClass) {
      IGroupSidebar.class = sidebarClass;
    }
    if (groupMappingClass) {
      IGroupMapping.class = groupMappingClass;
    }
    console.log('[SPLA] Core Framework: Domain components plugged successfully.');
  }
};
