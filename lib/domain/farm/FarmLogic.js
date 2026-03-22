/**
 * FarmLogic - Domain-specific logic for agricultural operations
 * Implements IDomainLogic contract
 */

import { IDomainLogic } from '../../core/contracts.js';

export class FarmLogic extends IDomainLogic {
  /**
   * Handles alert events with farm-specific logic
   */
  async onAlert(device) {
    console.log(`[SPLA-FARM] Alert event triggered for device: ${device.name}`);
  }
}
