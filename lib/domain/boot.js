/**
 * SPLA Domain Bootstrapper
 * 
 * This module is responsible for identifying the active domain via the
 * NEXT_PUBLIC_APP_DOMAIN environment variable and "plugging" it into
 * the Core SDK.
 */
export async function bootDomain() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN;

  // 1. Check for CORE mode or missing ENV
  if (!domain || domain === 'CORE') {
    console.log('[SPLA-BOOT] Running in standard CORE mode.');
    return;
  }

  console.log(`[SPLA-BOOT] Domain [${domain}] detected. Attempting to initialize...`);

  try {
    // 2. Resolve domain-specific orchestrator path
    // Convention: FACTORY -> /lib/domain/factory/FactoryDomain.js
    const domainKey = domain.toLowerCase();
    const className = domain.charAt(0) + domain.slice(1).toLowerCase() + 'Domain';

    const modulePath = `./${domainKey}/${className}.js`;

    // 3. Dynamic import the domain module
    const m = await import(modulePath);

    // 4. Trigger the plug() method (Standard interface for Domain Orchestrators)
    const domainOrchestrator = m.default || m[className];

    if (domainOrchestrator) {
      await domainOrchestrator.plug();
      await domainOrchestrator.play();
      console.log(`[SPLA-BOOT] Domain [${domain}] successfully authorized and plugged.`);
    } else {
      throw new Error(`Domain implementation [${className}] does not export a valid "plug" method.`);
    }

  } catch (error) {
    console.error(`[SPLA-BOOT] Initialization Error for [${domain}]:`, error.message);
  }
}
