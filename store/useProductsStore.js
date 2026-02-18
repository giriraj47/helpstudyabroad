import { create } from 'zustand';

const useProductsStore = create((set, get) => ({
  products: [],
  initialProducts: [],
  categories: [],
  loading: false,
  error: null,
  cache: {}, // Cache to store query results: { 'query': [products] }
  
  // Initialize store with server-fetched data
  initialize: (products, categories = []) => {
    set((state) => ({ 
      products, 
      initialProducts: products,
      categories,
      // Initialize cache with empty query mapping to initial products
      cache: { ...state.cache, '': products }
    }));
  },

  setProducts: (products) => set({ products }),

  // Async action to search products
  searchProducts: async (query) => {
    const trimmedQuery = query.trim();
    const { cache } = get();

    // Check cache first
    if (cache[trimmedQuery]) {
      set({ products: cache[trimmedQuery], loading: false, error: null });
      return;
    }

    try {
      set({ loading: true, error: null });
      
      const url = `/api/proxy/products/search?q=${encodeURIComponent(trimmedQuery)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      const transformedProducts = data.products.map(product => ({
        id: product.id,
        name: product.title,
        description: product.description,
        price: `$${product.price}`,
        category: product.category,
        features: product.tags || [],
        popular: product.rating > 4.5,
        image: product.thumbnail
      }));
      
      // Update state and cache
      set((state) => ({ 
        products: transformedProducts, 
        loading: false,
        cache: { ...state.cache, [trimmedQuery]: transformedProducts }
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useProductsStore;
