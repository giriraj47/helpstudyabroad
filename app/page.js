'use client';

import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  School,
  Public,
  EmojiEvents,
  RocketLaunch,
  ArrowForward,
  KeyboardArrowRight,
} from '@mui/icons-material';

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();

  const features = [
    {
      title: 'Global Network',
      description: 'Connect with students worldwide.',
      icon: <Public fontSize="medium" sx={{ color: '#3b82f6' }} />,
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Smart Matching',
      description: 'AI-driven program recommendations.',
      icon: <RocketLaunch fontSize="medium" sx={{ color: '#8b5cf6' }} />,
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Premium Services',
      description: 'Exclusive deals on travel & stay.',
      icon: <EmojiEvents fontSize="medium" sx={{ color: '#ec4899' }} />,
      bg: 'rgba(236, 72, 153, 0.1)',
    },
    {
      title: 'Scholarships',
      description: 'Find financial aid easily.',
      icon: <School fontSize="medium" sx={{ color: '#10b981' }} />,
      bg: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% -10%, #f0f9ff 0%, #ffffff 50%, #fff1f2 100%)',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // vertically center content if height allows, though minHeight handles full screen
      }}
    >
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: 12 }}>
        
        {/* Centered Hero Section */}
        <Box sx={{ textAlign: 'center', maxWidth: 1100, mx: 'auto', mb: 10, animation: 'fadeIn 0.8s ease-out' }}>
          {isAuthenticated && user && (
            <Chip 
              label={`Welcome back, ${user.firstName}!`} 
              color="primary" 
              variant="outlined" 
              sx={{ 
                mb: 4, 
                borderRadius: '50px', 
                fontWeight: 600, 
                bgcolor: 'rgba(37, 99, 235, 0.05)',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                animation: 'slideUp 0.5s ease-out'
              }} 
            />
          )}
          
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              background: 'linear-gradient(180deg, #0f172a 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Study Abroad <br />
            <span style={{ color: '#2563eb', WebkitTextFillColor: '#2563eb' }}>Made Simple.</span>
          </Typography>
          
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 6,
              mx: 'auto',
              maxWidth: 600,
              lineHeight: 1.6,
              fontWeight: 400,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            Your all-in-one platform to discover universities, connect with mentors, and manage your entire international education journey.
          </Typography>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center" 
            alignItems="center"
          >
            <Button
              component={Link}
              href="/users"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: '50px',
                px: 5,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: '#2563eb',
                boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  boxShadow: '0 20px 20px -5px rgba(37, 99, 235, 0.3)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              Start Exploring
            </Button>
            <Button
              component={Link}
              href="/products"
              variant="text"
              size="large"
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#475569',
                '&:hover': {
                  color: '#0f172a',
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              View Products
            </Button>
          </Stack>

           {/* Social Proof centered */}
           <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, opacity: 0.8 }}>
              <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 14 } }}>
                <Avatar src="https://dummyjson.com/icon/emilys/128" />
                <Avatar src="https://dummyjson.com/icon/michaelw/128" />
                <Avatar src="https://dummyjson.com/icon/sophiab/128" />
                <Avatar src="https://dummyjson.com/icon/jamesd/128" />
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Join 10,000+ students
              </Typography>
           </Box>
        </Box>

        {/* Feature Cards Row */}
        <Grid container spacing={4} justifyContent="center" sx={{ px: { xs: 2, md: 8 } }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  p: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.3s ease',
                  animation: `slideUp 0.8s ease-out ${index * 0.15 + 0.3}s forwards`,
                  opacity: 0,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.1)',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: '24px !important' }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: feature.bg,
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ fontSize: '1.1rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Container>
    </Box>
  );
}
