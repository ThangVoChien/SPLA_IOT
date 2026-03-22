/**
 * FarmSchema - Defines the database schema for farm fields
 * Implements IGroupSchema contract
 */

import { IGroupSchema } from '../../core/contracts.js';

export class FarmSchema extends IGroupSchema {
  /**
   * Model name for database ORM
   */
  getName() {
    return 'Field';
  }

  /**
   * Database table name for field groupings
   */
  getTableName() {
    return 'fields';
  }

  /**
   * Fields that must be unique within the organization
   */
  getUniqueFields() {
    return ['orgId', 'fieldCode'];
  }

  /**
   * Generate Prisma schema for Field model
   * Fields represent agricultural plots for device grouping
   */
  generate() {
    return `
model Field {
  id            String   @id @default(uuid())
  orgId         String
  description   String
  
  organization  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  devices       Device[]

  @@unique([orgId, fieldCode])
  @@map("fields")
}`;
  }
}

export const farmSchema = new FarmSchema();
