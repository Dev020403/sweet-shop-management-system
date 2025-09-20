import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  Chip,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Container,
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Refresh,
  ShoppingCart,
  TrendingUp,
  Category,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useSweets } from '../../hooks/useSweets';
import SweetCard from '../../components/common/SweetCard';
import LoadingSpinner, { PageLoading } from '../../components/common/LoadingSpinner';
import { SWEET_CATEGORIES, PAGINATION } from '../../constants/app';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);

  const {
    sweets,
    loading,
    error,
    pagination,
    searchSweets,
    updateFilters,
    changePage,
    changePageSize,
    purchaseSweet,
    restockSweet,
    refresh,
  } = useSweets();

  // Handle search
  const handleSearch = () => {
    const searchParams = {
      query: searchQuery.trim(),
      category: selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    if (searchQuery.trim() || selectedCategory || priceRange[0] > 0 || priceRange[1] < 100) {
      searchSweets(searchParams);
    } else {
      updateFilters({});
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 100]);
    updateFilters({});
  };

  // Handle purchase
  const handlePurchase = async (sweetId, quantity) => {
    try {
      await purchaseSweet(sweetId, quantity);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  // Handle restock (admin only)
  const handleRestock = async (sweetId, quantity) => {
    try {
      await restockSweet(sweetId, quantity);
    } catch (error) {
      console.error('Restock failed:', error);
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    changePage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (event) => {
    changePageSize(event.target.value);
  };

  if (loading && sweets.length === 0) {
    return <PageLoading message="Loading sweets..." />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            }}
          >
            <ShoppingCart
              sx={{
                fontSize: 48,
                color: 'white',
              }}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '-0.5px',
            }}
          >
            Welcome back, {user?.name}! 🍬
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Discover our delicious collection of sweets
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper
          elevation={24}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search Bar */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sweets..."
                variant="outlined"
                size="medium"
                sx={{
                  flex: 1,
                  minWidth: 300,
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
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#667eea' }} />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search />}
                sx={{
                  minWidth: 120,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
                sx={{
                  borderRadius: 2,
                  borderColor: '#667eea',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Filters
              </Button>
            </Box>

            {/* Advanced Filters */}
            {showFilters && (
              <Box sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                pt: 3,
                borderTop: '2px solid rgba(102, 126, 234, 0.1)',
                backgroundColor: 'rgba(102, 126, 234, 0.02)',
                borderRadius: 2,
                p: 3,
                mt: 1,
              }}>
                {/* Category Filter */}
                <FormControl sx={{ minWidth: 220 }}>
                  <InputLabel sx={{ color: '#667eea' }}>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <Category sx={{ color: '#667eea', mr: 1 }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {SWEET_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Price Range Filter */}
                <Box sx={{
                  minWidth: 250,
                  px: 2,
                  py: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                }}>
                  <Typography gutterBottom sx={{ color: '#4a5568', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ fontSize: 20, color: '#667eea' }} />
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(event, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}`}
                    min={0}
                    max={100}
                    step={1}
                    sx={{
                      color: '#667eea',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#667eea',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#667eea',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      },
                    }}
                  />
                </Box>

                {/* Filter Actions */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    startIcon={<Clear />}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#dc2626',
                        backgroundColor: 'rgba(239, 68, 68, 0.04)',
                      },
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={refresh}
                    startIcon={<Refresh />}
                    size="small"
                    sx={{
                      borderRadius: 2,
                      borderColor: '#10b981',
                      color: '#10b981',
                      '&:hover': {
                        borderColor: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.04)',
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>
            )}

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 100) && (
              <Box sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(102, 126, 234, 0.04)',
                borderRadius: 2,
                border: '1px solid rgba(102, 126, 234, 0.1)',
              }}>
                <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 600 }}>
                  🔍 Active filters:
                </Typography>
                {searchQuery && (
                  <Chip
                    label={`Search: "${searchQuery}"`}
                    onDelete={() => {
                      setSearchQuery('');
                      handleSearch();
                    }}
                    size="small"
                    sx={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                )}
                {selectedCategory && (
                  <Chip
                    label={`Category: ${selectedCategory}`}
                    onDelete={() => {
                      setSelectedCategory('');
                      handleSearch();
                    }}
                    size="small"
                    sx={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                )}
                {(priceRange[0] > 0 || priceRange[1] < 100) && (
                  <Chip
                    label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                    onDelete={() => {
                      setPriceRange([0, 100]);
                      handleSearch();
                    }}
                    size="small"
                    sx={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      '& .MuiChip-deleteIcon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              '& .MuiAlert-icon': {
                color: '#ef4444',
              },
            }}
          >
            {error}
          </Alert>
        )}

        {/* Results Summary */}
        <Paper
          elevation={12}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 3,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 600 }}>
            {pagination.total > 0 ? (
              <>
                📊 Showing {(pagination.page - 1) * pagination.limit + 1}-
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} sweets
              </>
            ) : (
              '🔍 No sweets found'
            )}
          </Typography>

          {/* Page Size Selector */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: '#667eea' }}>Per Page</InputLabel>
            <Select
              value={pagination.limit}
              label="Per Page"
              onChange={handlePageSizeChange}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(102, 126, 234, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#667eea',
                },
              }}
            >
              {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Sweets Grid */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <LoadingSpinner loading={true} message="Loading sweets..." />
          </Box>
        )}

        {sweets.length > 0 ? (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {sweets.map((sweet) => (
                <Grid item xs={12} sm={6} lg={3} key={sweet.id}>
                  <SweetCard
                    sweet={sweet}
                    onPurchase={handlePurchase}
                    onRestock={isAdmin ? handleRestock : undefined}
                    loading={loading}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paper
                  elevation={12}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#667eea',
                        '&.Mui-selected': {
                          backgroundColor: '#667eea',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#764ba2',
                          },
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.04)',
                        },
                      },
                    }}
                  />
                </Paper>
              </Box>
            )}
          </>
        ) : (
          !loading && (
            <Paper
              elevation={12}
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Typography variant="h4" sx={{ mb: 2, color: '#4a5568' }}>
                🍭 No sweets found
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: '#718096' }}>
                Try adjusting your search criteria or clear the filters to see all available sweets.
              </Typography>
              <Button
                variant="contained"
                onClick={handleClearFilters}
                startIcon={<Clear />}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          )
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;