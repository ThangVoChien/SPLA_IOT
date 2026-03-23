import { IDomainLogic } from "../../core/contracts.js";

/**
 * HomeLogic
 * Specialized logic for the Home domain.
 */
export class HomeLogic extends IDomainLogic {
  async onAlert(device) {
    console.log(
      `[HOME] Alert triggered for node: ${device.name} (${device.macAddress})`,
    );
    // Domain automation hook (e.g., trigger smart home routine)
  }
}
