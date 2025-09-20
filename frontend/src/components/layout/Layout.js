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
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Store,
  Dashboard,
  ExitToApp,
  Person,
  Admin,
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Logo/Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              mr: 3,
            }}
            onClick={() => navigate('/')}
          >
            <Store sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Sweet Shop
            </Typography>
          </Box>

          {/* Navigation - Desktop */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Button
                color={isActive('/') ? 'primary' : 'inherit'}
                startIcon={<Dashboard />}
                onClick={() => navigate('/')}
                sx={{
                  fontWeight: isActive('/') ? 600 : 400,
                  backgroundColor: isActive('/') ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
                }}
              >
                Dashboard
              </Button>
              
              {isAdmin && (
                <Button
                  color={isActive('/admin') ? 'primary' : 'inherit'}
                  startIcon={<Admin />}
                  onClick={() => navigate('/admin')}
                  sx={{
                    fontWeight: isActive('/admin') ? 600 : 400,
                    backgroundColor: isActive('/admin') ? 'rgba(255, 107, 157, 0.1)' : 'transparent',
                  }}
                >
                  Admin Panel
                </Button>
              )}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: 'rgba(255, 107, 157, 0.1)',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                {/* Shopping Cart - could be implemented later */}
                <IconButton color="inherit">
                  <Badge badgeContent={0} color="primary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Mobile Menu */}
                {isMobile && (
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}

                {/* User Menu */}
                {!isMobile && (
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        width: 36,
                        height: 36,
                        fontSize: '0.9rem',
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                )}
              </>
            )}
          </Box>

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
                minWidth: 180,
              },
            }}
          >
            {isAuthenticated ? (
              <>
                {/* Mobile Navigation */}
                {isMobile && (
                  <>
                    <MenuItem onClick={() => handleNavigation('/')}>
                      <Dashboard sx={{ mr: 1 }} />
                      Dashboard
                    </MenuItem>
                    {isAdmin && (
                      <MenuItem onClick={() => handleNavigation('/admin')}>
                        <Admin sx={{ mr: 1 }} />
                        Admin Panel
                      </MenuItem>
                    )}
                    <MenuItem divider />
                  </>
                )}

                <MenuItem onClick={handleMenuClose}>
                  <Person sx={{ mr: 1 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => handleNavigation('/login')}>
                  Login
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/register')}>
                  Sign Up
                </MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          background: theme.palette.background.gradient,
          minHeight: 'calc(100vh - 64px)',
          py: 3,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
