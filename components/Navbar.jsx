'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import useAuthStore from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { deleteSession } from '@/app/actions';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Container,
} from '@mui/material';
import {
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, loadUser } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Initialize user session
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isActive = (path) => pathname === path;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    logout();
    handleClose();
    await deleteSession();
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo/Home */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>
                H
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HelpStudy
            </Typography>
          </Link>

          {/* Navigation Links & Auth */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated && (
              <>
                <Button
                  component={Link}
                  href="/users"
                  variant={isActive('/users') ? 'contained' : 'text'}
                  sx={{
                    ...(isActive('/users') && {
                      bgcolor: '#2563eb',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                      '&:hover': {
                        bgcolor: '#1e40af',
                      },
                    }),
                    ...(!isActive('/users') && {
                      color: 'text.primary',
                    }),
                  }}
                >
                  Users
                </Button>
                <Button
                  component={Link}
                  href="/products"
                  variant={isActive('/products') ? 'contained' : 'text'}
                  sx={{
                    ...(isActive('/products') && {
                      bgcolor: '#7c3aed',
                      color: 'white',
                      boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
                      '&:hover': {
                        bgcolor: '#6d28d9',
                      },
                    }),
                    ...(!isActive('/products') && {
                      color: 'text.primary',
                    }),
                  }}
                >
                  Products
                </Button>
              </>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              <Box sx={{ ml: 1 }}>
                <Button
                  onClick={handleClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    textTransform: 'none',
                    color: 'text.primary',
                  }}
                  endIcon={<ArrowDownIcon />}
                >
                  <Avatar
                    src={user?.image || 'https://via.placeholder.com/40'}
                    alt={user?.firstName || 'User'}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'block' },
                    }}
                  >
                    {user?.firstName} {user?.lastName}
                  </Typography>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 256,
                      borderRadius: 3,
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: 'error.main',
                      gap: 1,
                      py: 1.5,
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    Sign Out
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                onClick={() => router.push('/login')}
                variant="contained"
                sx={{
                  ml: 1,
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
                  '&:hover': {
                    boxShadow: '0 20px 25px -5px rgba(124, 58, 237, 0.4)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
