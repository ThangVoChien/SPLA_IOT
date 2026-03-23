import { IGroupSidebar } from "../../core/contracts.js";

/**
 * HomeSidebar
 * Navigation link for the Home domain.
 */
export class HomeSidebar extends IGroupSidebar {
  getLabel() {
    return "Smart Home";
  }
  getHref() {
    return "/dashboard/home";
  }
  getIcon() {
    return "bi-house-door-fill";
  }
}
