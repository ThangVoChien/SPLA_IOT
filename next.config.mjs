import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function ensureAdmin() {
  try {
    // Check if tables exist by trying a simple query
    try {
      await prisma.organization.findFirst();
    } catch (dbError) {
      if (dbError.code === 'P2021' || dbError.message.includes('does not exist')) {
        console.log('🏗️ Database tables missing. Initializing with prisma db push...');
        const databaseUrl = process.env.DATABASE_URL || 'file:../prisma/dev.db';
        execSync('npx prisma db push --accept-data-loss --skip-generate', {
          stdio: 'inherit',
          cwd: process.cwd(),
          env: {
            ...process.env,
            DATABASE_URL: databaseUrl
          }
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
  
  // SPLA: Phased Domain Bootstrapper (Server Phase)
  import('./lib/domain/boot.js').then(m => {
    m.bootServer();
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
