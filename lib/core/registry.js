import { IDomainLogic, IDashboardWidget, IGroupSidebar, IGroupUtils } from './contracts';

/**
 * SPLA Plug-and-Play Registry (Core Only)
 * Allows external domains to inject their specialized classes 
 * without core implementation dependencies.
 */
export const Registry = {
  /**
   * Plugs domain-specific specialized classes into the Core.
   */
  plug(logicClass, widgetClass, sidebarClass, groupUtilsClass) {
    if (logicClass) {
      IDomainLogic.class = logicClass;
    }
    if (widgetClass) {
      IDashboardWidget.class = widgetClass;
    }
    if (sidebarClass) {
      IGroupSidebar.class = sidebarClass;
    }
    if (groupUtilsClass) {
      IGroupUtils.class = groupUtilsClass;
    }
    console.log('[SPLA] Core Framework: Domain components plugged successfully.');
  }
};
