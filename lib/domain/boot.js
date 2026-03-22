/**
 * SPLA Domain Bootstrapper (Phased Execution)
 */

async function getOrchestrator() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN;
  if (!domain || domain === 'CORE') return null;

  try {
    const domainKey = domain.toLowerCase();
    const className = domain.charAt(0) + domain.slice(1).toLowerCase() + 'Domain';
    
    // Attempt dynamic import based on naming convention
    // e.g., FACTORY -> ./factory/FactoryDomain.js
    const m = await import(`./${domainKey}/${className}.js`);
    return m.default || m[className];
  } catch (err) {
    console.warn(`[SPLA-BOOT] Dynamic load failed for [${domain}]:`, err.message);
    return null;
  }
}

/**
 * PHASE 1: SERVER-SIDE (Database / Prisma)
 * Call this from next.config.mjs or server startup.
 */
export async function bootServer() {
  const orchestrator = await getOrchestrator();
  if (orchestrator && orchestrator.play) {
    await orchestrator.play();
  }
}

/**
 * PHASE 2: CLIENT-SIDE (Registry / UI)
 * Call this from a Client Component (Layout/Provider).
 */
export async function bootClient() {
  const orchestrator = await getOrchestrator();
  if (orchestrator && orchestrator.plug) {
    await orchestrator.plug();
  }
}
