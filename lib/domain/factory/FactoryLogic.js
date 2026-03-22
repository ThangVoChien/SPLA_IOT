import { IDomainLogic } from '../../core/contracts.js';

/**
 * FactoryLogic
 * Specialized logic for the Factory domain.
 */
export class FactoryLogic extends IDomainLogic {
  async onAlert(device) {
    console.log(`[FACTORY] Alert triggered for node: ${device.name} (${device.macAddress})`);
    // Automation logic here (e.g., stopping the assembly line)
  }
}
