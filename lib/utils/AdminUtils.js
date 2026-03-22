/**
 * Enhanced Client-Side API Utility for Administrative Operations.
 * Supports granular RESTful paths and semantic HTTP methods.
 */
export async function adminUtils(resource, method = 'POST', data = {}, id = null) {
  try {
    const url = id ? `/api/admin/${resource}/${id}` : `/api/admin/${resource}`;
    
    // For specific operations like role change, we might use a sub-path if needed, 
    // but here we'll stick to semantic methods on the resource ID.
    // Special case for role change: PATCH /api/admin/users/[id]
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'Operation failed' };
    }

    return { success: true, data: result };
  } catch (err) {
    return { error: 'Network communication error' };
  }
}
