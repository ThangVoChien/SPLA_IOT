/**
 * Prisma Client Extension for Tenant Isolation.
 * Intercepts Prisma queries and enforces `orgId` boundaries.
 */

export function getTenantClient(prismaBase, orgId) {
  if (!orgId) {
    throw new Error('Tenant Scope violation: No orgId provided');
  }

  // Models that explicitly have an orgId column
  const tenantModels = ['User', 'Device'];

  return prismaBase.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (tenantModels.includes(model)) {
            // Apply the tenant boundary on reads and updates
            if (
              [
                'findUnique',
                'findFirst',
                'findMany',
                'update',
                'updateMany',
                'delete',
                'deleteMany',
                'count',
                'aggregate'
              ].includes(operation)
            ) {
              args.where = { ...args.where, orgId };
            }

            // Force the orgId on creations
            if (operation === 'create') {
              args.data = { ...args.data, orgId };
            }
            if (operation === 'createMany') {
              if (Array.isArray(args.data)) {
                args.data = args.data.map((d) => ({ ...d, orgId }));
              }
            }
          }

          return query(args);
        },
      },
    },
  });
}
