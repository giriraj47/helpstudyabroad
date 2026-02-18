// Auth API utility functions for DummyJSON authentication

const API_BASE_URL = '/api/proxy';

/**
 * Login user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data with tokens
 */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60, // Token expires in 60 minutes
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error during login');
  }
}

/**
 * Get current authenticated user
 * @param {string} token - Access token
 * @returns {Promise<Object>} User data
 */
export async function getCurrentUser(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error while fetching user');
  }
}

/**
 * Refresh authentication token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export async function refreshAuthToken(refreshToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 60,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error while refreshing token');
  }
}
