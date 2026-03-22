/**
 * Client-Side API Utility for User-level Device Operations.
 * Targets /api/devices (not /api/admin).
 */
export async function deviceUtils(method = 'GET', data = {}, id = null, subResource = null) {
  try {
    let url = id ? `/api/devices/${id}` : `/api/devices`;
    if (subResource) url += `/${subResource}`;

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Operation failed' };
    }

    return { success: true, data: result };
  } catch (err) {
    return { error: 'Network communication error' };
  }
}
