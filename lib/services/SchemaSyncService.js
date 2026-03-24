import { prisma } from '../db/prisma.js';

/**
 * Schema Synchronization Service
 * 
 * Generic service to sync domain-specific group schemas to database.
 * Supports any domain with customizable table names and fields.
 */
export class SchemaSyncService {
  /**
   * Sync domain group schema to database
   * 
   * @param {Object} schemaConfig - Schema configuration object
   * @param {string} schemaConfig.name - Model name (e.g., ProductionArea, Ward, Field)
   * @param {string} schemaConfig.tableName - Table name (e.g., production_areas, wards)
   * @param {Object} schemaConfig.customFields - Custom fields beyond base fields
   *        Format: { fieldName: { type: 'TEXT'|'INTEGER'|'DATETIME', ... } }
   * @param {Array<string>} schemaConfig.indexes - Fields to create indexes on
   * 
   * @example
   * const config = {
   *   name: 'ProductionArea',
   *   tableName: 'production_areas',
   *   customFields: {
   *     areaNumber: { type: 'INTEGER' },
   *     type: { type: 'TEXT' }
   *   },
   *   indexes: ['name', 'areaNumber']
   * };
   * await SchemaSyncService.syncGroupSchema(config);
   */
  static async syncGroupSchema(schemaConfig) {
    try {
      const { name, tableName, customFields = {}, indexes = [] } = schemaConfig;
      
      console.log(`[SCHEMA-SYNC] Syncing ${name} schema to ${tableName} table...`);

      // Build base columns
      let createTableSQL = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
      `;

      // Add custom fields
      for (const [fieldName, fieldConfig] of Object.entries(customFields)) {
        const type = fieldConfig.type || 'TEXT';
        createTableSQL += `\n          ${fieldName} ${type},`;
      }

      // Add timestamps
      createTableSQL += `
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Create table
      await prisma.$executeRawUnsafe(createTableSQL);

      // Create indexes
      for (const indexField of indexes) {
        const indexName = `idx_${tableName}_${indexField}`;
        await prisma.$executeRawUnsafe(
          `CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName}(${indexField})`
        );
      }

      // Add foreign key column to devices
      const fkColumnName = `${tableName.slice(0, -1)}Id`; // Remove 's' for singular
      const deviceColumns = await prisma.$queryRaw`PRAGMA table_info(devices)`;
      const hasFkColumn = deviceColumns.some(col => col.name === fkColumnName);

      if (!hasFkColumn) {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE devices ADD COLUMN ${fkColumnName} TEXT REFERENCES ${tableName}(id) ON DELETE SET NULL`
        );
      }

      console.log(`[SCHEMA-SYNC] ${name} schema synced successfully`);
      return true;
    } catch (error) {
      console.error(`[SCHEMA-SYNC] Failed to sync schema:`, error.message);
      return false;
    }
  }
}
