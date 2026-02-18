import { create } from 'zustand';
import { login as apiLogin, getCurrentUser } from '@/lib/auth';

const useAuthStore = create((set) => ({
  user: null,
  loading: true, // Start with loading true to check for existing session
  error: null,
  isAuthenticated: false,

  // Action to check for existing session on mount
  loadUser: async () => {
    try {
      let storedUser = localStorage.getItem('user');
      let storedToken = localStorage.getItem('accessToken');

      // If no token in localStorage, check cookies
      if (!storedToken) {
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
        if (cookieToken) {
           storedToken = cookieToken.split('=')[1];
        }
      }

      if (storedToken) {
        // Ensure cookie is set (sync with localStorage if missing)
        if (!document.cookie.includes('accessToken=')) {
             document.cookie = `accessToken=${storedToken}; path=/; max-age=${60 * 60}`;
        }

        // Optimistically set user from storage if available
        if (storedUser) {
            set({ 
                user: JSON.parse(storedUser), 
                isAuthenticated: true, 
                loading: true // keep loading true while verifying token
            });
        }

        // Verify token is still valid by fetching current user
        try {
          const userData = await getCurrentUser(storedToken);
          // Update storage with fresh data
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('accessToken', storedToken);
          set({ user: userData, isAuthenticated: true, loading: false });
        } catch (err) {
          // Token expired or invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          document.cookie = 'accessToken=; path=/; max-age=0';
          set({ user: null, isAuthenticated: false, loading: false });
        }
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error('Error loading user:', err);
      set({ loading: false, error: err.message });
    }
  },

  // Login action
  login: async (username, password) => {
    try {
      set({ loading: true, error: null });

      const data = await apiLogin(username, password);

      // Store user and tokens
      const userData = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      // Set cookie for middleware
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${60 * 60}`;

      set({ user: userData, isAuthenticated: true, loading: false, error: null });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false, isAuthenticated: false });
      return { success: false, error: err.message };
    }
  },

  // Logout action
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear cookies with all possible path/domain combinations to be safe
    document.cookie = 'accessToken=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'accessToken=; path=/; domain=' + window.location.hostname + '; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

export default useAuthStore;
