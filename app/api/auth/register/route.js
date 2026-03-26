import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { orgName, username, password } = await request.json();
  const cookieStore = await cookies();

  try {
    const normalizedOrgName = String(orgName ?? '').trim();
    const normalizedUsername = String(username ?? '').trim();
    const normalizedPassword = String(password ?? '');

    if (!normalizedOrgName || !normalizedUsername || !normalizedPassword) {
      return NextResponse.json(
        { error: 'orgName, username, and password are required' },
        { status: 400 }
      );
    }

    const org = await prisma.organization.upsert({
      where: { name: normalizedOrgName },
      update: {},
      create: { name: normalizedOrgName }
    });

    const hashedPassword = await bcrypt.hash(normalizedPassword, 10);
    const user = await prisma.user.create({
      data: {
        orgId: org.id,
        username: normalizedUsername,
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
