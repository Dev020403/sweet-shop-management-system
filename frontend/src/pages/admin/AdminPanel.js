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
} from '@mui/material';
import {
  Add,
  Dashboard as DashboardIcon,
  Inventory,
} from '@mui/icons-material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useSweets } from '../../hooks/useSweets';
import SweetCard from '../../components/common/SweetCard';
import { SWEET_CATEGORIES } from '../../constants/app';
import { PageLoading } from '../../components/common/LoadingSpinner';

// Sweet form validation schema
const sweetSchema = yup.object({
  name: yup.string().required('Sweet name is required').min(2, 'Name must be at least 2 characters'),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').min(0.01, 'Price must be greater than 0'),
  quantity: yup.number().required('Quantity is required').min(0, 'Quantity cannot be negative'),
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
    control,
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
  const outOfStockCount = sweets.filter(sweet => sweet.quantity === 0).length;
  const lowStockCount = sweets.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 5).length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);

  if (loading && sweets.length === 0) {
    return <PageLoading message="Loading admin panel..." />;
  }

  return (
    <Box>
      {/* Header */}
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
          Admin Panel 👨‍💼
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your sweet shop inventory and operations
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
              {totalSweets}
            </Typography>
            <Typography color="text.secondary">Total Sweets</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
              ${totalValue.toFixed(2)}
            </Typography>
            <Typography color="text.secondary">Total Value</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="error.main" sx={{ fontWeight: 700 }}>
              {outOfStockCount}
            </Typography>
            <Typography color="text.secondary">Out of Stock</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
              {lowStockCount}
            </Typography>
            <Typography color="text.secondary">Low Stock</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<DashboardIcon />} label="Inventory" />
            <Tab icon={<Inventory />} label="Stock Alerts" />
          </Tabs>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddSweet}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Add Sweet
          </Button>
        </Box>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
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
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Stock Alerts
          </Typography>

          {outOfStockCount === 0 && lowStockCount === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h6" color="success.main">
                ✅ All items are well stocked!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {sweets
                .filter(sweet => sweet.quantity === 0 || (sweet.quantity > 0 && sweet.quantity <= 5))
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
          )}
        </Box>
      </TabPanel>

      {/* Add/Edit Sweet Dialog */}
      <Dialog
        open={addSweetDialog || editSweetDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.25rem',
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
          }}
        >
          {selectedSweet ? '✏️ Update Sweet' : '➕ Add New Sweet'}
        </DialogTitle>

        <form onSubmit={handleSubmit(selectedSweet ? onSubmitEdit : onSubmitAdd)}>
          <DialogContent sx={{ p: 3 }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Basic Info
                </Typography>
                <TextField
                  {...register('name')}
                  label="Sweet Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
                <TextField
                  {...register('category')}
                  select
                  label="Category"
                  fullWidth
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  sx={{ mb: 2 }}
                >
                  {SWEET_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>

                <Typography variant="subtitle2" sx={{ mb: 1, mt: 2, fontWeight: 600 }}>
                  Stock & Pricing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      {...register('price')}
                      label="Price ($)"
                      type="number"
                      fullWidth
                      inputProps={{ step: '0.01', min: '0' }}
                      error={!!errors.price}
                      helperText={errors.price?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      {...register('quantity')}
                      label="Quantity"
                      type="number"
                      fullWidth
                      inputProps={{ min: '0' }}
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined" sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ borderRadius: 2 }}>
              {selectedSweet ? 'Update Sweet' : 'Add Sweet'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
