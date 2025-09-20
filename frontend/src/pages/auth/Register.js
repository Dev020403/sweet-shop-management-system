import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  ShoppingCart,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup
    .string()
    .oneOf(['user', 'admin'], 'Invalid role')
    .required('Role is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isAuthenticated, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user', // default role
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setRegisterError('');
      clearErrors();

      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);

      navigate('/login', {
        replace: true,
        state: { message: 'Registration successful! Please sign in.' },
      });
    } catch (error) {
      setRegisterError(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  if (loading) {
    return <LoadingSpinner loading={true} fullScreen message="Checking authentication..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2,
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Card
        elevation={24}
        sx={{
          maxWidth: 440,
          width: '100%',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              }}
            >
              <ShoppingCart
                sx={{
                  fontSize: 36,
                  color: 'white',
                }}
              />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: '#2d3748',
                letterSpacing: '-0.5px',
              }}
            >
              Join Us Today
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Create your account to get started
            </Typography>
          </Box>

          {/* Error Alert */}
          {registerError && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#ef4444',
                },
              }}
            >
              {registerError}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Full Name Field */}
              <TextField
                {...register('name')}
                label="Full Name"
                placeholder="Enter your full name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color={errors.name ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />

              {/* Email Field */}
              <TextField
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color={errors.email ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />

              {/* Role Selection */}
              <TextField
                select
                {...register('role')}
                label="Account Type"
                defaultValue="user"
                error={!!errors.role}
                helperText={errors.role?.message || 'Choose your account type'}
                disabled={isSubmitting}
                SelectProps={{ native: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AdminPanelSettings color={errors.role ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              >
                <option value="user">👤 Regular User</option>
                <option value="admin">⚡ Administrator</option>
              </TextField>

              {/* Password Field */}
              <TextField
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.password ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleTogglePassword} 
                        disabled={isSubmitting} 
                        edge="end"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.04)',
                          },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color={errors.confirmPassword ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPassword}
                        disabled={isSubmitting}
                        edge="end"
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.04)',
                          },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(226, 232, 240, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      '& fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  py: 1.8,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
                  },
                }}
              >
                {isSubmitting ? (
                  <LoadingSpinner size={24} color="inherit" message="" />
                ) : (
                  '🚀 Create Account'
                )}
              </Button>
            </Box>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 4, '&::before, &::after': { borderColor: 'rgba(226, 232, 240, 0.6)' } }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              or
            </Typography>
          </Divider>

          {/* Sign In Link */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#764ba2',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>

          {/* Terms and Privacy */}
          <Box
            sx={{
              textAlign: 'center',
              p: 3,
              backgroundColor: 'rgba(102, 126, 234, 0.04)',
              borderRadius: 2,
              border: '1px solid rgba(102, 126, 234, 0.1)',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              🔒 By creating an account, you agree to our{' '}
              <Link href="#" sx={{ color: '#667eea', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" sx={{ color: '#667eea', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Privacy Policy
              </Link>
              .
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;