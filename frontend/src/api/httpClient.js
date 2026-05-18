const API_BASE_URL = '/api/v1';

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await readErrorBody(response);
    const message = errorBody?.error?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function readErrorBody(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
