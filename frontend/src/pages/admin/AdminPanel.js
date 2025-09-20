import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Alert,
  Tab,
  Tabs,
  Container,
  Card,
} from '@mui/material';
import {
  Add,
  Dashboard as DashboardIcon,
  TrendingUp,
  Warning,
  CheckCircle,
  AttachMoney,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useSweets } from '../../hooks/useSweets';
import SweetCard from '../../components/common/SweetCard';
import { SWEET_CATEGORIES } from '../../constants/app';
import { PageLoading } from '../../components/common/LoadingSpinner';

// Sweet form validation schema
const sweetSchema = yup.object({
  name: yup
    .string()
    .required('Sweet name is required')
    .min(2, 'Name must be at least 2 characters'),
  category: yup.string().required('Category is required'),
  price: yup
    .number()
    .required('Price is required')
    .min(0.01, 'Price must be greater than 0'),
  quantity: yup
    .number()
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),
  description: yup.string().max(500, 'Description must be less than 500 characters'),
  image: yup.string().url('Please enter a valid URL').optional(),
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminPanel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [addSweetDialog, setAddSweetDialog] = useState(false);
  const [editSweetDialog, setEditSweetDialog] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);
  const [formError, setFormError] = useState('');

  const {
    sweets,
    loading,
    error,
    addSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
  } = useSweets();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(sweetSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
      description: '',
      image: '',
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddSweet = () => {
    reset();
    setSelectedSweet(null);
    setFormError('');
    setAddSweetDialog(true);
  };

  const handleEditSweet = (sweet) => {
    setSelectedSweet(sweet);
    setValue('name', sweet.name);
    setValue('category', sweet.category);
    setValue('price', sweet.price);
    setValue('quantity', sweet.quantity);
    setValue('description', sweet.description || '');
    setValue('image', sweet.image || '');
    setFormError('');
    setEditSweetDialog(true);
  };

  const handleDeleteSweet = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet? This action cannot be undone.')) {
      try {
        await deleteSweet(sweetId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleRestockSweet = async (sweetId, quantity) => {
    try {
      await restockSweet(sweetId, quantity);
    } catch (error) {
      console.error('Restock failed:', error);
    }
  };

  const onSubmitAdd = async (data) => {
    try {
      setFormError('');
      await addSweet(data);
      setAddSweetDialog(false);
      reset();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to add sweet');
    }
  };

  const onSubmitEdit = async (data) => {
    try {
      setFormError('');
      await updateSweet(selectedSweet.id, data);
      setEditSweetDialog(false);
      reset();
      setSelectedSweet(null);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to update sweet');
    }
  };

  const handleCloseDialog = () => {
    setAddSweetDialog(false);
    setEditSweetDialog(false);
    setSelectedSweet(null);
    setFormError('');
    reset();
  };

  // Calculate stats
  const totalSweets = sweets.length;
  const outOfStockCount = sweets.filter((sweet) => sweet.quantity === 0).length;
  const lowStockCount = sweets.filter((sweet) => sweet.quantity > 0 && sweet.quantity <= 5).length;
  const totalValue = sweets.reduce((sum, sweet) => sum + sweet.price * sweet.quantity, 0);

  if (loading && sweets.length === 0) {
    return <PageLoading message="Loading admin panel..." />;
  }

  const stats = [
    {
      title: 'Total Products',
      value: totalSweets,
      icon: <DashboardIcon sx={{ fontSize: 24 }} />,
      color: '#667eea',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
    },
    {
      title: 'Total Value',
      value: `$${totalValue.toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 24 }} />,
      color: '#10b981',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
    },
    {
      title: 'Out of Stock',
      value: outOfStockCount,
      icon: <Warning sx={{ fontSize: 24 }} />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
    },
    {
      title: 'Low Stock',
      value: lowStockCount,
      icon: <TrendingUp sx={{ fontSize: 24 }} />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fed7aa',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: '#1e293b',
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Manage your sweet shop inventory and monitor performance
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: '12px',
                border: `1px solid ${stat.borderColor}`,
                backgroundColor: stat.bgColor,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 0.5 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Navigation and Actions */}
      <Paper
        sx={{
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 0 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minHeight: 48,
                color: '#64748b',
                '&.Mui-selected': {
                  color: '#667eea',
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#667eea',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab icon={<DashboardIcon />} label="All Products" iconPosition="start" />
            <Tab icon={<Warning />} label="Stock Alerts" iconPosition="start" />
          </Tabs>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddSweet}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              px: 3,
              py: 1.5,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)',
              },
            }}
          >
            Add New Product
          </Button>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: '12px',
            border: '1px solid #fecaca',
            backgroundColor: '#fef2f2',
          }}
        >
          {error}
        </Alert>
      )}

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {sweets.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="h5" sx={{ color: '#64748b', mb: 2 }}>
              No products available
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3 }}>
              Start building your inventory by adding your first sweet product.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddSweet}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '10px',
                px: 4,
                py: 1.5,
              }}
            >
              Add First Product
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {sweets.map((sweet) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={sweet.id}>
                <SweetCard
                  sweet={sweet}
                  onEdit={handleEditSweet}
                  onDelete={handleDeleteSweet}
                  onRestock={handleRestockSweet}
                  loading={loading}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1e293b' }}>
            Stock Alert Management
          </Typography>

          {outOfStockCount === 0 && lowStockCount === 0 ? (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: '16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#065f46', fontWeight: 600, mb: 1 }}>
                All Stock Levels Optimal
              </Typography>
              <Typography variant="body1" sx={{ color: '#059669' }}>
                Great job! All your products are well-stocked and ready for customers.
              </Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <Alert
                  severity="warning"
                  sx={{
                    borderRadius: '12px',
                    border: '1px solid #fed7aa',
                    backgroundColor: '#fffbeb',
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    {outOfStockCount > 0 && `${outOfStockCount} products are out of stock. `}
                    {lowStockCount > 0 && `${lowStockCount} products are running low.`} Consider restocking soon to avoid
                    lost sales.
                  </Typography>
                </Alert>
              </Box>

              <Grid container spacing={3}>
                {sweets
                  .filter((sweet) => sweet.quantity === 0 || (sweet.quantity > 0 && sweet.quantity <= 5))
                  .map((sweet) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={sweet.id}>
                      <SweetCard
                        sweet={sweet}
                        onEdit={handleEditSweet}
                        onDelete={handleDeleteSweet}
                        onRestock={handleRestockSweet}
                        loading={loading}
                      />
                    </Grid>
                  ))}
              </Grid>
            </>
          )}
        </Box>
      </TabPanel>

      {/* Add/Edit Sweet Dialog */}
      <Dialog
        open={addSweetDialog || editSweetDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Title */}
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.6rem',
            py: 3,
            px: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          {selectedSweet ? 'Update Product' : 'Add New Product'}
        </DialogTitle>

        {/* Form */}
        <form onSubmit={handleSubmit(selectedSweet ? onSubmitEdit : onSubmitAdd)}>
          <DialogContent
            sx={{
              p: 4,
              backgroundColor: '#f9fafb',
              maxHeight: '70vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '4px' },
            }}
          >
            {formError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  backgroundColor: '#fef2f2',
                  fontWeight: 500,
                }}
              >
                {formError}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                {...register('name')}
                label="Product Name"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />

              <TextField
                {...register('category')}
                select
                label="Category"
                fullWidth
                error={!!errors.category}
                helperText={errors.category?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              >
                {SWEET_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                {...register('price')}
                type="number"
                label="Price"
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
                inputProps={{ step: '0.01' }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />

              <TextField
                {...register('quantity')}
                type="number"
                label="Quantity"
                fullWidth
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Box>
          </DialogContent>

          {/* Actions */}
          <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f9fafb' }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                textTransform: 'none',
                px: 3,
                borderRadius: '8px',
                fontWeight: 500,
                color: '#64748b',
                '&:hover': { backgroundColor: '#e5e7eb' },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: 'none',
                px: 3,
                borderRadius: '8px',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                '&:hover': { boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)' },
              }}
            >
              {selectedSweet ? 'Save Changes' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
