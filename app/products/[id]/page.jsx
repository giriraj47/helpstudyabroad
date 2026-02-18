'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Rating,
  Divider,
  Stack,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  LocalShipping as ShippingIcon,
  Inventory as StockIcon,
  Star as StarIcon,
} from '@mui/icons-material';

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#2563eb', mb: 2 }} size={56} />
          <Typography color="text.secondary">Loading product...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #fce7f3 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button
            component={Link}
            href="/products"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            sx={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)', mt: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    );
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          component={Link}
          href="/products"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            color: '#64748b',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: '#f1f5f9', color: '#2563eb' },
          }}
        >
          Back to Products
        </Button>

        {/* Main Card */}
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 0,
            }}
          >
            {/* Image Section */}
            <Box sx={{ p: 4, borderRight: { md: '1px solid #f1f5f9' }, bgcolor: '#fcfcfc' }}>
              {/* Main Image */}
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  mb: 2,
                  bgcolor: '#ffffff',
                  border: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 340,
                  p: 2,
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </Box>

              {/* Thumbnail Strip */}
              {product.images?.length > 1 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {product.images.map((img, i) => (
                    <Box
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: selectedImage === img ? '#2563eb' : '#e2e8f0',
                        cursor: 'pointer',
                        bgcolor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 0.5,
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: '#94a3b8' },
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Details Section */}
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {/* Category & Brand */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  label={product.category}
                  size="small"
                  sx={{
                    bgcolor: '#eff6ff',
                    color: '#2563eb',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    border: '1px solid #bfdbfe',
                  }}
                />
                {product.brand && (
                  <Chip
                    label={product.brand}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: '#cbd5e1', color: '#64748b', fontWeight: 600 }}
                  />
                )}
                {product.rating > 4.5 && (
                  <Chip
                    label="⭐ Top Rated"
                    size="small"
                    sx={{ bgcolor: '#fffbeb', color: '#b45309', fontWeight: 600, border: '1px solid #fcd34d' }}
                  />
                )}
              </Stack>

              {/* Title */}
              <Typography
                variant="h4"
                sx={{ 
                  fontWeight: 800, 
                  mb: 1.5, 
                  color: '#1e293b', 
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                {product.title}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ color: '#fbbf24' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {product.rating} / 5
                </Typography>
              </Box>

              {/* Price */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      color: '#2563eb',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    ${discountedPrice}
                  </Typography>
                  {product.discountPercentage > 0 && (
                    <>
                      <Typography
                        variant="h6"
                        sx={{ textDecoration: 'line-through', color: '#94a3b8', fontWeight: 500 }}
                      >
                        ${product.price}
                      </Typography>
                      <Chip
                        label={`-${product.discountPercentage.toFixed(0)}%`}
                        size="small"
                        sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 700, borderRadius: 1 }}
                      />
                    </>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

              {/* Description */}
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7, color: '#475569' }}>
                {product.description}
              </Typography>

              {/* Tags */}
              {product.tags?.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#0f172a', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    TAGS
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {product.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ bgcolor: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Stock & Shipping */}
              <Stack spacing={2} sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <StockIcon sx={{ color: product.stock > 0 ? '#10b981' : '#ef4444', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: product.stock > 0 ? '#059669' : '#b91c1c', fontWeight: 500 }}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of stock'}
                  </Typography>
                </Box>
                {product.shippingInformation && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ShippingIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {product.shippingInformation}
                    </Typography>
                  </Box>
                )}
                {product.returnPolicy && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <StarIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {product.returnPolicy}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {/* CTA */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#2563eb',
                  color: '#ffffff',
                  py: 2,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
                  '&:hover': {
                    bgcolor: '#1d4ed8',
                    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 4px 6px -2px rgba(37, 99, 235, 0.15)',
                  },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>

          {/* Reviews Section */}
          {product.reviews?.length > 0 && (
            <Box sx={{ p: 4, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                Customer Reviews
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 3,
                }}
              >
                {product.reviews.map((review, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      boxShadow: 'sm',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {review.reviewerName}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" sx={{ color: '#fbbf24' }} />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#475569', lineHeight: 1.5 }}>
                      "{review.comment}"
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
