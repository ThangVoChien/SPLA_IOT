import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_CONFIG_PATH = path.join(__dirname, 'devices.json');
const DEFAULT_INGEST_URL = 'http://localhost:5678/webhook/simulator';


class VirtualDevice {
  constructor(config) {
    this.macAddress = config.macAddress;
  }

  generateNextValue() {
    return Number((Math.random() * 100).toFixed(2));
  }

  buildIngestPayload() {
    return {
      macAddress: this.macAddress,
      value: this.generateNextValue(),
    };
  }
}

function readDevices(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`devices.json not found: ${configPath}`);
  }

  const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(`devices config must be non-empty array: ${configPath}`);
  }

  return parsed.map((item) => new VirtualDevice(item));
}

function pickRandomDevices(devices) {
  if (!Array.isArray(devices) || devices.length === 0) {
    return [];
  }

  const targetCount = Math.floor(Math.random() * devices.length) + 1;
  const shuffled = [...devices];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, targetCount);
}

async function postIngest(ingestUrl, payload) {
  const response = await fetch(ingestUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    body: bodyText,
  };
}

async function flushBatch(devices, ingestUrl) {
  const start = Date.now();
  const results = await Promise.allSettled(
    devices.map(async (device) => {
      const payload = device.buildIngestPayload();
      const res = await postIngest(ingestUrl, payload);
      return {
        macAddress: device.macAddress,
        value: payload.value,
        status: res.status,
        ok: res.ok,
      };
    }),
  );

  let okCount = 0;
  let failCount = 0;

  for (const item of results) {
    if (item.status === 'fulfilled' && item.value.ok) {
      okCount += 1;
    } else {
      failCount += 1;
    }
  }

  const latency = Date.now() - start;
  console.log(`[BATCH] devices=${devices.length} ok=${okCount} fail=${failCount} latency=${latency}ms`);
}

async function run() {
  const args = {
    ingestUrl: process.env.SIMULATOR_INGEST_URL || DEFAULT_INGEST_URL,
    configPath: DEFAULT_CONFIG_PATH,
    domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'CORE',
  };
  const devices = readDevices(args.configPath, args.domain);

  console.log('==========================================');
  console.log('         SPLA IoT Batch Simulator         ');
  console.log(` ingest=${args.ingestUrl}`);
  console.log(` config=${args.configPath}`);
  console.log(` devices=${devices.length}`);
  console.log(` domain=${args.domain || 'ALL'}`);
  console.log('==========================================\n');

  let stopped = false;
  let inFlight = false;

  const stop = (reason) => {
    if (stopped) return;
    stopped = true;
    console.log(`\n[SIM] stopped: ${reason}`);
  };

  process.on('SIGINT', () => stop('SIGINT'));
  process.on('SIGTERM', () => stop('SIGTERM'));

  while (!stopped) {
    const randomTickMs = Math.floor(Math.random() * 6001);

    if (!inFlight) {
      inFlight = true;
      const selectedDevices = pickRandomDevices(devices);
      await flushBatch(selectedDevices, args.ingestUrl);
      inFlight = false;
    }

    await new Promise((resolve) => setTimeout(resolve, randomTickMs));
  }
}

run().catch((error) => {
  console.error(`[SIM-FATAL] ${error.message}`);
  process.exitCode = 1;
});
