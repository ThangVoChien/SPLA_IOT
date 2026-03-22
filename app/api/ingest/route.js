import { NextResponse } from 'next/server';
import { IngestService } from '@/lib/services/IngestService';

/**
 * Mocking a Core Generic Evaluator for sandbox testing.
 * In a true SPLA deployment, the domain app registers its specific evaluator into a DomainRegistry.
 */
class CoreFallbackEvaluator {
  evaluate(value, threshold) {
    let breach = false;
    const op = String(threshold.operator).trim();
    const limit = threshold.thresholdValue;

    switch (op) {
      case 'GREATER_THAN': case '>': breach = value > limit; break;
      case 'LESS_THAN': case '<': breach = value < limit; break;
      case 'EQUAL': case '==': case '===': breach = value === limit; break;
      case '>=': breach = value >= limit; break;
      case '<=': breach = value <= limit; break;
    }
    return breach ? 'WARNING' : null;
  }
  validatePayload(data) {
    return typeof data.value === 'number';
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { macAddress, value } = body;

    if (!macAddress || value === undefined) {
      return NextResponse.json({ error: 'Missing macAddress or value' }, { status: 400 });
    }

    // Utilize Strategy Pattern injected into Engine
    const evaluator = new CoreFallbackEvaluator();
    const engine = new IngestService(evaluator);

    try {
      const result = await engine.processTelemetry(macAddress, value);
      return NextResponse.json(result, { status: 200 });
    } catch (error) {
      if (error.message === 'Device not registered') {
        return NextResponse.json({ error: 'Forbidden: Device not recognized' }, { status: 403 });
      }
      throw error; // Re-throw for general catch
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
