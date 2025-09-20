import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Edit,
  Delete,
  Add,
  Remove,
  Inventory,
  LocalOffer,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const SweetCard = ({
  sweet,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
  loading = false,
}) => {
  const { isAdmin } = useAuth();
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [restockDialog, setRestockDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const handlePurchase = () => {
    if (onPurchase) onPurchase(sweet.id, quantity);
    setPurchaseDialog(false);
    setQuantity(1);
  };

  const handleRestock = () => {
    if (onRestock) onRestock(sweet.id, restockQuantity);
    setRestockDialog(false);
    setRestockQuantity(1);
  };

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;


  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: '16px',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          opacity: loading ? 0.7 : 1,
          '&:hover': {
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
            borderColor: '#cbd5e1',
          },
        }}
      >
        {/* Stock Badge */}
        {(isOutOfStock || isLowStock) && (
          <Chip
            label={isOutOfStock ? 'Out of Stock' : 'Low Stock'}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontWeight: 600,
              fontSize: '0.75rem',
              backgroundColor: isOutOfStock ? '#fef2f2' : '#fffbeb',
              color: isOutOfStock ? '#dc2626' : '#d97706',
              border: `1px solid ${isOutOfStock ? '#fecaca' : '#fed7aa'}`,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        )}

        <CardContent sx={{ flex: 1, p: 3 }}>
          {/* Category and Stock */}
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={sweet.category}
              size="small"
              icon={<LocalOffer sx={{ fontSize: '14px !important' }} />}
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
                color: '#667eea',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                '& .MuiChip-icon': {
                  color: '#667eea',
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{ 
                fontWeight: 600,
                color: isLowStock ? '#d97706' : isOutOfStock ? '#dc2626' : '#10b981',
                fontSize: '0.75rem',
                backgroundColor: isLowStock ? '#fffbeb' : isOutOfStock ? '#fef2f2' : '#f0fdf4',
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                border: `1px solid ${isLowStock ? '#fed7aa' : isOutOfStock ? '#fecaca' : '#bbf7d0'}`,
              }}
            >
              Stock: {sweet.quantity}
            </Typography>
          </Box>

          {/* Sweet Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              fontSize: '1.1rem',
              color: '#1e293b',
              mb: 1,
            }}
          >
            {sweet.name}
          </Typography>

          {/* Description */}
          {sweet.description && (
            <Typography
              variant="body2"
              sx={{ 
                color: '#64748b',
                lineHeight: 1.5,
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {sweet.description}
            </Typography>
          )}

          <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#667eea',
                fontSize: '1.5rem',
              }}
            >
              ${sweet.price?.toFixed(2)}
            </Typography>
            {!isOutOfStock && (
              <Typography
                variant="caption"
                sx={{ 
                  color: '#64748b',
                  backgroundColor: '#f8fafc',
                  px: 1,
                  py: 0.5,
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
              >
                per unit
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => setPurchaseDialog(true)}
            disabled={isOutOfStock || loading}
            fullWidth
            sx={{
              borderRadius: '10px',
              fontWeight: 600,
              textTransform: 'none',
              py: 1.5,
              fontSize: '0.875rem',
              background: isOutOfStock 
                ? '#f1f5f9' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: isOutOfStock ? '#64748b' : 'white',
              boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.25)',
              '&:hover': {
                boxShadow: isOutOfStock ? 'none' : '0 6px 16px rgba(102, 126, 234, 0.35)',
                background: isOutOfStock 
                  ? '#f1f5f9' 
                  : 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              },
              '&:disabled': {
                background: '#f1f5f9',
                color: '#94a3b8',
              },
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
              <Tooltip title="Restock Item" placement="top">
                <IconButton
                  size="small"
                  onClick={() => setRestockDialog(true)}
                  sx={{
                    backgroundColor: '#f0fdf4',
                    color: '#10b981',
                    border: '1px solid #bbf7d0',
                    '&:hover': {
                      backgroundColor: '#dcfce7',
                      borderColor: '#86efac',
                    },
                  }}
                >
                  <Inventory sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Item" placement="top">
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(sweet)}
                  sx={{
                    backgroundColor: '#eff6ff',
                    color: '#3b82f6',
                    border: '1px solid #bfdbfe',
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                      borderColor: '#93c5fd',
                    },
                  }}
                >
                  <Edit sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Item" placement="top">
                <IconButton
                  size="small"
                  onClick={() => onDelete?.(sweet.id)}
                  sx={{
                    backgroundColor: '#fef2f2',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    '&:hover': {
                      backgroundColor: '#fee2e2',
                      borderColor: '#fca5a5',
                    },
                  }}
                >
                  <Delete sx={{ fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </CardActions>
      </Card>

      {/* Purchase Dialog */}
      <Dialog
        open={purchaseDialog}
        onClose={() => setPurchaseDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#1e293b',
          pb: 1,
        }}>
          Purchase {sweet.name}
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ 
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            p: 2.5,
            mb: 3,
            border: '1px solid #e2e8f0',
          }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
              Available Stock
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {sweet.quantity} units remaining
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2, color: '#64748b', fontWeight: 500 }}>
            Select quantity:
          </Typography>
          
          <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
            <IconButton
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              sx={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
                '&:disabled': {
                  backgroundColor: '#f8fafc',
                  color: '#cbd5e1',
                },
              }}
            >
              <Remove />
            </IconButton>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(
                    1,
                    Math.min(sweet.quantity, parseInt(e.target.value) || 1)
                  )
                )
              }
              inputProps={{ min: 1, max: sweet.quantity }}
              sx={{ 
                width: 100,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  textAlign: 'center',
                  '& input': {
                    textAlign: 'center',
                    fontWeight: 600,
                  },
                },
              }}
              size="small"
            />
            <IconButton
              onClick={() =>
                setQuantity(Math.min(sweet.quantity, quantity + 1))
              }
              disabled={quantity >= sweet.quantity}
              sx={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
                '&:disabled': {
                  backgroundColor: '#f8fafc',
                  color: '#cbd5e1',
                },
              }}
            >
              <Add />
            </IconButton>
          </Box>
          
          <Box sx={{
            backgroundColor: '#eff6ff',
            borderRadius: '12px',
            p: 2.5,
            border: '1px solid #bfdbfe',
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Unit Price:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                ${sweet.price?.toFixed(2)}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Total Amount:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#667eea' }}>
                ${(sweet.price * quantity).toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setPurchaseDialog(false)}
            sx={{
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePurchase}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              px: 3,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.35)',
              },
            }}
          >
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      {isAdmin && (
        <Dialog
          open={restockDialog}
          onClose={() => setRestockDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <DialogTitle sx={{ 
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#1e293b',
            pb: 1,
          }}>
            Restock {sweet.name}
          </DialogTitle>
          <DialogContent sx={{ pb: 2 }}>
            <Box sx={{ 
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              p: 2.5,
              mb: 3,
              border: '1px solid #bbf7d0',
            }}>
              <Typography variant="body2" sx={{ color: '#059669', mb: 1 }}>
                Current Stock Level
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#065f46' }}>
                {sweet.quantity} units in inventory
              </Typography>
            </Box>
            
            <TextField
              fullWidth
              label="Quantity to Add"
              type="number"
              value={restockQuantity}
              onChange={(e) =>
                setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              inputProps={{ min: 1 }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
            
            <Box sx={{
              backgroundColor: '#eff6ff',
              borderRadius: '12px',
              p: 2.5,
              border: '1px solid #bfdbfe',
            }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                New Total Stock: {sweet.quantity + restockQuantity} units
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={() => setRestockDialog(false)}
              sx={{
                color: '#64748b',
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#f8fafc',
                },
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleRestock}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)',
                },
              }}
            >
              Confirm Restock
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SweetCard;