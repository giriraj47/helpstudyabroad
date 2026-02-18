import { create } from 'zustand';

const useUsersStore = create((set, get) => ({
  users: [],
  initialUsers: [],
  loading: false,
  error: null,
  cache: {}, // Cache for queries
  
  // Initialize store with server-fetched data
  initialize: (users) => {
    set((state) => ({ 
      users, 
      initialUsers: users,
      cache: { ...state.cache, '': users }
    }));
  },

  setUsers: (users) => set({ users }),

  // Async action to search users
  searchUsers: async (query) => {
    const trimmedQuery = query.trim();
    const { cache } = get();

    if (cache[trimmedQuery]) {
      set({ users: cache[trimmedQuery], loading: false, error: null });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const url = `/api/proxy/users/search?q=${encodeURIComponent(trimmedQuery)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      
      const transformedUsers = data.users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        company: user.company,
        role: user.role,
        country: user.address?.country || 'Unknown',
        program: user.company?.department || 'General',
        status: user.id % 3 === 0 ? 'Pending' : 'Active'
      }));
      
      set((state) => ({ 
        users: transformedUsers, 
        loading: false, 
        cache: { ...state.cache, [trimmedQuery]: transformedUsers }
      }));
    } catch (err) {
      console.error('Error fetching users:', err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useUsersStore;
