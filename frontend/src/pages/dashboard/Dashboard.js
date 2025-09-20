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
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Refresh,
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
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #FF6B9D, #4A90E2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome back, {user?.name}! 🍬
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover our delicious collection of sweets
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Search Bar */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sweets..."
              variant="outlined"
              size="medium"
              sx={{ flex: 1, minWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
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
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              startIcon={<FilterList />}
            >
              Filters
            </Button>
          </Box>

          {/* Advanced Filters */}
          {showFilters && (
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 2, borderTop: 1, borderColor: 'divider' }}>
              {/* Category Filter */}
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
              <Box sx={{ minWidth: 200, px: 2 }}>
                <Typography gutterBottom>
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
                />
              </Box>

              {/* Filter Actions */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  startIcon={<Clear />}
                  size="small"
                >
                  Clear
                </Button>
                <Button
                  variant="outlined"
                  onClick={refresh}
                  startIcon={<Refresh />}
                  size="small"
                >
                  Refresh
                </Button>
              </Box>
            </Box>
          )}

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 100) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => {
                    setSearchQuery('');
                    handleSearch();
                  }}
                  size="small"
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
                />
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results Summary */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          {pagination.total > 0 ? (
            <>
              Showing {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} sweets
            </>
          ) : (
            'No sweets found'
          )}
        </Typography>

        {/* Page Size Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per Page</InputLabel>
          <Select
            value={pagination.limit}
            label="Per Page"
            onChange={handlePageSizeChange}
          >
            {PAGINATION.PAGE_SIZE_OPTIONS.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
              <Grid item xs={12} sm={6} md={4} lg={3} key={sweet.id}>
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
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      ) : (
        !loading && (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              No sweets found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or clear the filters to see all available sweets.
            </Typography>
            <Button variant="outlined" onClick={handleClearFilters} startIcon={<Clear />}>
              Clear Filters
            </Button>
          </Paper>
        )
      )}
    </Box>
  );
};

export default Dashboard;
