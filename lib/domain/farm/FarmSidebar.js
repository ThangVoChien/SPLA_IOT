'use client'

import { IGroupSidebar } from '../../core/contracts.js';

/**
 * FarmSidebar - Navigation extension for farm management
 * Implements IGroupSidebar contract
 */
export class FarmSidebar extends IGroupSidebar {
  /**
   * Display label for sidebar navigation
   */
  getLabel() {
    return 'Field Management';
  }

  /**
   * Target route for farm domain dashboard
   */
  getHref() {
    return '/dashboard/farm';
  }

  /**
   * Bootstrap icon class for visual identification
   */
  getIcon() {
    return 'bi-tree';
  }

  /**
   * Farm management module is not admin-only
   * Regular users can manage their assigned fields
   */
  isAdmin() {
    return false;
  }
}
