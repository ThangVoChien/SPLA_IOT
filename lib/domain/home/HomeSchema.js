import { IGroupSchema } from "../../core/contracts.js";

/**
 * HomeSchema
 * Domain-specific schema implementation for HomeZone group model.
 */
export class HomeSchema extends IGroupSchema {
  getName() {
    return "HomeZone";
  }

  getTableName() {
    return "home_zones";
  }

  getUniqueFields() {
    return ["name"];
  }

  generate() {
    return `
/**
 * HomeZone Model (Home Domain)
 * Groups devices into household areas/rooms
 */
model HomeZone {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  floor       Int?
  category    String?
  devices     Device[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([name])
  @@index([floor])
  @@map("home_zones")
}
    `.trim();
  }
}

export const homeSchema = new HomeSchema();
