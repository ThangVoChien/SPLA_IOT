import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { orgName, username, password } = await request.json();
  const cookieStore = await cookies();

  try {
    const org = await prisma.organization.upsert({
      where: { name: orgName },
      update: {},
      create: { name: orgName }
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        orgId: org.id,
        username,
        passwordHash: hashedPassword,
        role: 'USER'
      }
    });

    const payload = { userId: user.id, orgId: user.orgId, role: user.role };
    const sessionToken = await AuthService.encrypt(payload);

    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
