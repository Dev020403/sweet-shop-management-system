import React from 'react';
import {
  Box,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Dashboard,
  ExitToApp,
  Person,
  AdminPanelSettings,
  Home,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => location.pathname === path;

  // Don't show header on auth pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Box sx={{ minHeight: '100vh' }}>
        <CssBaseline />
        {children}
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 1, minHeight: '72px' }}>
          {/* Logo/Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 4,
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
              }}
            >
              <ShoppingCart sx={{ color: 'white', fontSize: 22 }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                display: { xs: 'none', sm: 'block' },
                fontSize: '1.25rem',
              }}
            >
              Sweet Shop
            </Typography>
          </Box>

          {/* Navigation - Desktop */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Button
                startIcon={<Home />}
                onClick={() => navigate('/')}
                sx={{
                  color: isActive('/') ? '#667eea' : '#64748b',
                  fontWeight: isActive('/') ? 600 : 500,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 1.5,
                  backgroundColor: isActive('/') ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    color: '#667eea',
                  },
                }}
              >
                Dashboard
              </Button>
              
              {isAdmin && (
                <Button
                  startIcon={<AdminPanelSettings />}
                  onClick={() => navigate('/admin')}
                  sx={{
                    color: isActive('/admin') ? '#667eea' : '#64748b',
                    fontWeight: isActive('/admin') ? 600 : 500,
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 3,
                    py: 1.5,
                    backgroundColor: isActive('/admin') ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      color: '#667eea',
                    },
                  }}
                >
                  Admin
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{ 
                    display: { xs: 'none', sm: 'inline-flex' },
                    color: '#64748b',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(100, 116, 139, 0.08)',
                    },
                  }}
                >
                  Sign in
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 4,
                    py: 1,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                {/* Shopping Cart */}
                <IconButton 
                  sx={{
                    color: '#64748b',
                    '&:hover': {
                      backgroundColor: 'rgba(100, 116, 139, 0.08)',
                    },
                  }}
                >
                  <Badge 
                    badgeContent={2} 
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.75rem',
                        minWidth: '18px',
                        height: '18px',
                      }
                    }}
                  >
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Mobile Menu */}
                {isMobile && (
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ 
                      color: '#64748b',
                      '&:hover': {
                        backgroundColor: 'rgba(100, 116, 139, 0.08)',
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {/* User Menu - Desktop */}
                {!isMobile && (
                  <Button
                    onClick={handleMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: '#1e293b',
                      textTransform: 'none',
                      borderRadius: '12px',
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(100, 116, 139, 0.08)',
                      },
                    }}
                    endIcon={<KeyboardArrowDown />}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: '#667eea',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', lineHeight: 1.2 }}>
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </Typography>
                    </Box>
                  </Button>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* User/Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            borderRadius: '12px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            '& .MuiMenuItem-root': {
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              py: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(100, 116, 139, 0.08)',
              },
            },
          },
        }}
      >
        {isAuthenticated ? (
          <>
            {/* User Info */}
            <Box sx={{ p: 3, pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#667eea',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                    {user?.email}
                  </Typography>
                  <Chip
                    label={isAdmin ? 'Administrator' : 'User'}
                    size="small"
                    sx={{
                      backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: isAdmin ? '#ef4444' : '#10b981',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                </Box>
              </Box>
            </Box>
            
            <Divider />

            {/* Mobile Navigation */}
            {isMobile && (
              <>
                <MenuItem onClick={() => handleNavigation('/')}>
                  <Home sx={{ mr: 2, color: '#64748b' }} />
                  <Typography sx={{ fontWeight: 500 }}>Dashboard</Typography>
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => handleNavigation('/admin')}>
                    <AdminPanelSettings sx={{ mr: 2, color: '#64748b' }} />
                    <Typography sx={{ fontWeight: 500 }}>Admin Panel</Typography>
                  </MenuItem>
                )}
                <Divider sx={{ my: 1 }} />
              </>
            )}

            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 2, color: '#64748b' }} />
              <Typography sx={{ fontWeight: 500 }}>Profile Settings</Typography>
            </MenuItem>
            
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 2, color: '#ef4444' }} />
              <Typography sx={{ fontWeight: 500, color: '#ef4444' }}>Sign out</Typography>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleNavigation('/login')}>
              <Typography sx={{ fontWeight: 500 }}>Sign in</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/register')}>
              <Typography sx={{ fontWeight: 500 }}>Get Started</Typography>
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 72px)',
          backgroundColor: '#f8fafc',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;