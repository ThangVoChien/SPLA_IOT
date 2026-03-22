import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export async function PUT(request) {
  const session = await AuthService.getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { telegramChatId, telegramEnabled } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        telegram: {
          upsert: {
            create: {
              chatId: telegramChatId || null,
              isEnabled: telegramEnabled !== undefined ? telegramEnabled : true
            },
            update: {
              chatId: telegramChatId || null,
              isEnabled: telegramEnabled !== undefined ? telegramEnabled : undefined
            }
          }
        }
      },
      select: {
        id: true,
        username: true,
        telegram: {
          select: {
            chatId: true,
            isEnabled: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}
