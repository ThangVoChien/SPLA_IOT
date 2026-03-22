/**
 * Enhanced Client-Side API Utility for Authentication.
 * Communicates with dedicated RESTful auth endpoints.
 */
export async function authUtils(operation, data = {}) {
  try {
    // Map operations to dedicated routes
    const routes = {
      'LOGIN': '/api/auth/login',
      'LOGOUT': '/api/auth/logout',
      'REGISTER': '/api/auth/register'
    };

    const url = routes[operation];
    if (!url) throw new Error('Invalid auth operation');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Authentication failed' };
    }

    return { success: true, data: result };
  } catch (err) {
    return { error: 'Network communication error' };
  }
}
