'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useProductsStore from '@/store/useProductsStore';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

export default function ProductsClient({ initialProducts, initialCategories, selectedCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Use Zustand store
  const { 
    products, 
    categories, 
    loading, 
    initialize, 
    searchProducts 
  } = useProductsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Initialize store with server data
  useEffect(() => {
    initialize(initialProducts, initialCategories);
  }, [initialProducts, initialCategories, initialize]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search via store action
  useEffect(() => {
    searchProducts(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchProducts]);

  // Handle category change with URL navigation (server-side)
  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #2563eb, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Our Products & Services
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Comprehensive solutions to make your study abroad journey smooth and successful
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'background.paper',
              },
            }}
          />
          {debouncedSearchQuery && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Searching for "{debouncedSearchQuery}"...
            </Typography>
          )}
        </Box>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mb: 6 }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category === 'all' ? 'All Products' : String(category).replace(/-/g, ' ')}
              onClick={() => handleCategoryChange(category)}
              color={category === selectedCategory ? 'primary' : 'default'}
              variant={category === selectedCategory ? 'filled' : 'outlined'}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                ...(category === selectedCategory && {
                  bgcolor: '#2563eb',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: '#1d4ed8',
                  },
                  boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                }),
              }}
            />
          ))}
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Products Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              style={{ textDecoration: 'none', display: 'contents' }}
            >
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                borderRadius: 4,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Product Image */}
                {product.image && (
                  <CardMedia
                    component="img"
                    height="100"
                    image={product.image}
                    alt={product.name}
                    sx={{ bgcolor: 'grey.50', objectFit: 'cover' }}
                  />
                )}
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    color: '#2563eb',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3, pb: '16px !important' }}>
                {/* Product Name & Description */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 1, 
                    fontSize: '1.1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2, 
                    flexGrow: 1, 
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {product.description}
                </Typography>

                {/* Price & CTA */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', paddingTop: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                      Price
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                      {product.price}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                         bgcolor: '#eff6ff',
                         borderColor: '#1d4ed8',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
            </Link>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
