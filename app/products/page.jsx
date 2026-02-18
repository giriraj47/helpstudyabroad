import ProductsClient from '@/components/ProductsClient';

export default async function ProductsPage({ searchParams }) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams;
  const category = params?.category || 'all';

  // Fetch categories on the server with caching
  const categoriesResponse = await fetch('https://dummyjson.com/products/categories', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!categoriesResponse.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categoriesData = await categoriesResponse.json();
  const categoryNames = categoriesData.map(cat => cat.slug || cat);
  const categories = ['all', ...categoryNames];

  // Fetch products based on selected category (server-side with caching)
  let productsUrl;
  if (category === 'all') {
    productsUrl = 'https://dummyjson.com/products?limit=10&skip=0';
  } else {
    productsUrl = `https://dummyjson.com/products/category/${category}`;
  }

  const productsResponse = await fetch(productsUrl, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });

  if (!productsResponse.ok) {
    throw new Error('Failed to fetch products');
  }

  const productsData = await productsResponse.json();

  // Transform the API data
  const initialProducts = productsData.products.map(product => ({
    id: product.id,
    name: product.title,
    description: product.description,
    price: `$${product.price}`,
    category: product.category,
    features: product.tags || [],
    popular: product.rating > 4.5,
    image: product.thumbnail
  }));

  return (
    <ProductsClient 
      initialProducts={initialProducts} 
      initialCategories={categories}
      selectedCategory={category}
    />
  );
}
