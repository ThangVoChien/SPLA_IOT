import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/AuthService';

/**
 * Returns the current session information for the logged-in user.
 * Used by client-side providers to identify the user's organization scope.
 */
export async function GET() {
  try {
    const session = await AuthService.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: session.id,
      username: session.username,
      role: session.role,
      orgId: session.orgId
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
