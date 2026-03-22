import { EventEmitter } from 'events';

const globalForEventBus = globalThis;

/**
 * Singleton EventBus (Observer Pattern)
 * Used to pipe telemetry and alerts from the IngestService to the SSE Stream Provider.
 */
export const globalEventBus =
  globalForEventBus.eventBus || new EventEmitter();

if (process.env.NODE_ENV !== 'production') globalForEventBus.eventBus = globalEventBus;
