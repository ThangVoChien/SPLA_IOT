import { IGroupSchema } from '../../core/contracts.js';

/**
 * FactorySchema
 * 
 * Domain-specific schema implementation for Factory ProductionArea group model.
 * Defines the structure for organizing devices within factory production contexts.
 */
export class FactorySchema extends IGroupSchema {
  /**
   * Model name
   */
  getName() {
    return 'ProductionArea';
  }

  /**
   * Database table name
   */
  getTableName() {
    return 'production_areas';
  }

  /**
   * Unique constraint fields
   */
  getUniqueFields() {
    return ['name'];
  }

  /**
   * Generate Prisma schema definition
   */
  generate() {
    return `
/**
 * ProductionArea Model (Factory Domain)
 * Groups devices within factory production contexts
 */
model ProductionArea {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  areaNumber  Int?
  type        String?
  devices     Device[]
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([name])
  @@index([areaNumber])
  @@map("production_areas")
}
    `.trim();
  }
}

/**
 * Factory schema singleton instance
 */
export const factorySchema = new FactorySchema();
