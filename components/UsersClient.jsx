'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import useUsersStore from '@/store/useUsersStore';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Public as PublicIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';

export default function UsersClient({ initialUsers, total, page, limit }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    users, 
    loading, 
    initialize, 
    searchUsers 
  } = useUsersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Initialize store
  useEffect(() => {
    initialize(initialUsers);
  }, [initialUsers, initialize]);

  // Debounce search query - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search users via store action
  useEffect(() => {
    searchUsers(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchUsers]);

  const handlePageChange = (event, value) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', value);
    router.push(`/users?${params.toString()}`);
  };

  const showPagination = !debouncedSearchQuery && !loading && total > 0;
  const count = Math.ceil(total / limit);

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
        <Box sx={{ mb: 6 }}>
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
            Users
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage and view all students in the study abroad program
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or location..."
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

        {/* Loading indicator for search */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Users Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          {users.map((user) => (
            <Card
              key={user.id}
              component={Link}
              href={`/users/${user.id}`}
              sx={{
                textDecoration: 'none',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent 
                sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  height: '100%',
                  '&:last-child': { pb: 2 },
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'relative', mb: 2, alignSelf: 'flex-start' }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: '#eff6ff', 
                      color: '#2563eb',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    {user.firstName?.charAt(0)}
                  </Avatar>
                </Box>
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    mb: 0.5,
                    lineHeight: 1.2,
                    color: '#1e293b',
                  }}
                >
                  {user.firstName} {user.lastName}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '0.8rem',
                    mb: 1.5,
                    color: '#2563eb',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  {user.company?.title || user.role || 'User'}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.5,
                    }}
                  >
                    {user.address?.city}, {user.address?.stateCode}
                  </Typography>

                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      fontSize: '0.75rem',
                      display: 'block',
                      opacity: 0.8,
                    }}
                  >
                    {user.age} yrs • {user.gender}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        {showPagination && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={count} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="large"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
