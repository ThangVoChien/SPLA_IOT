import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.join(process.cwd(), 'lib', 'domain', 'dev.db')}`
    }
  }
});

async function ensureAdmin() {
  try {
    // Check if tables exist by trying a simple query
    try {
      await prisma.organization.findFirst();
    } catch (dbError) {
      if (dbError.code === 'P2021' || dbError.message.includes('does not exist')) {
        console.log('🏗️ Database tables missing. Initializing with prisma db push...');
        // Use the path relative to the prisma/ folder where the schema is located
        const relativeDbPath = '../lib/domain/dev.db';
        const envCmd = process.platform === 'win32' ? `set DATABASE_URL=file:${relativeDbPath} &&` : `DATABASE_URL=file:${relativeDbPath}`;
        execSync(`${envCmd} npx prisma db push --accept-data-loss`, { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
        console.log('✅ Database initialized successfully.');
      } else {
        throw dbError;
      }
    }

    const org = await prisma.organization.upsert({
      where: { name: 'SPLA IOT' },
      update: {},
      create: { name: 'SPLA IOT' }
    });
    
    const passwordHash = await bcrypt.hash('admin', 10);
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        orgId: org.id,
        username: 'admin',
        passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user and SPLA IOT organization ensured on startup.');
  } catch (error) {
    console.error('❌ Startup initialization failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run on dev/build startup
if (process.env.NODE_ENV !== 'production' || process.env.PHASE === 'phase-production-build') {
  ensureAdmin();
  
  // SPLA: Centralized Domain Bootstrapper (Plug and Play)
  import('./lib/domain/boot.js').then(m => {
    m.bootDomain();
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
