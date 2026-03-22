import { globalEventBus } from '@/lib/core/event-bus';
import { AuthService } from '@/lib/services/AuthService';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Validate Auth for the stream
  const session = await AuthService.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));

      const onTelemetry = (data) => {
        if (data.orgId === session.orgId) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'telemetry', payload: data })}\n\n`));
        }
      };

      const onAlert = (data) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'alert', payload: data })}\n\n`));
      };

      const onStatsUpdate = (data) => {
        if (data.orgId === session.orgId) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'stats_update' })}\n\n`));
        }
      };

      globalEventBus.on('telemetry', onTelemetry);
      globalEventBus.on('alert', onAlert);
      globalEventBus.on('stats_update', onStatsUpdate);

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        globalEventBus.off('telemetry', onTelemetry);
        globalEventBus.off('alert', onAlert);
        globalEventBus.off('stats_update', onStatsUpdate);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
