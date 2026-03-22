import { IGroupSidebar } from '../../core/contracts.js';

/**
 * FactorySidebar
 * Navigation link for the Factory domain.
 */
export class FactorySidebar extends IGroupSidebar {
  getLabel() { return "Digital Factory"; }
  getHref() { return "/dashboard/factory"; }
  getIcon() { return "bi-buildings"; }
}
