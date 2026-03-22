import { prisma } from '../db/prisma';
import { NotificationService } from './NotificationService';
import { globalEventBus } from '../core/event-bus';
import { IDomainLogic } from '../core/contracts';

export class IngestService {
  constructor() {
    // [Injection via constructor]: Instantiate the domain logic only if set via Registry.plug()
    const LogicClass = IDomainLogic.class;
    this.domainLogic = LogicClass ? new LogicClass() : null;
  }

  async processTelemetry(macAddress, value) {
    // 1. Identify Device
    const device = await prisma.device.findUnique({
      where: { macAddress },
      include: {
        sensor: true,
        threshold: true,
      }
    });

    if (!device) {
      throw new Error('Device not registered');
    }

    // 2. [CORE] Core Validation
    if (typeof value !== 'number') {
      throw new Error('Payload value must be a number');
    }

    // 3. Log Telemetry & Update Device Status
    const telemetry = await prisma.telemetry.create({
      data: {
        deviceId: device.id,
        value
      }
    });

    // Mark device as ACTIVE since it's now transmitting
    if (device.status !== 'ACTIVE') {
      await prisma.device.update({
        where: { id: device.id },
        data: { status: 'ACTIVE' }
      });
    }

    // Fire generic telemetry SSE for dashboard
    globalEventBus.emit('telemetry', {
      deviceId: device.id,
      orgId: device.orgId,
      macAddress,
      value,
      timestamp: telemetry.timestamp
    });

    // 4. [CORE] Core Threshold Evaluation
    if (device.threshold) {
      const severity = this._evaluateThreshold(value, device.threshold);

      if (severity) {
        // Create Alert Msg using database template
        const message = NotificationService.parseTemplate(device.sensor.alertTemplate, {
          device: device.name,
          value,
          unit: device.sensor.unit
        });

        const alert = await prisma.alert.create({
          data: {
            thresholdId: device.threshold.id,
            triggeredValue: value,
            message: message,
            severity
          }
        });

        // Fire Notifications
        await NotificationService.sendTelegramAlert(device.orgId, message);
        globalEventBus.emit('alert', {
          ...alert,
          deviceName: device.name,
          macAddress: device.macAddress
        });

        // 5. [SPLA HOOK] Call domain logic for post-alert actions
        if (this.domainLogic) {
          this.domainLogic.onAlert(device).catch(err => {
            console.error(`[SPLA-HOOK] onAlert failed:`, err);
          });
        }
      }
    }

    return { success: true, telemetryId: telemetry.id };
  }

  /**
   * Core Implementation of threshold checks
   */
  _evaluateThreshold(value, threshold) {
    const op = String(threshold.operator).trim();
    const limit = threshold.thresholdValue;
    let breach = false;

    switch (op) {
      case 'GREATER_THAN': case '>': breach = value > limit; break;
      case 'LESS_THAN': case '<': breach = value < limit; break;
      case 'EQUAL': case '==': case '===': breach = value === limit; break;
      case '>=': breach = value >= limit; break;
      case '<=': breach = value <= limit; break;
    }
    return breach ? 'WARNING' : null;
  }
}
