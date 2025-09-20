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

  const defaultImage =
    'https://www.shutterstock.com/shutterstock/photos/2475063097/display_1500/stock-photo-colorful-of-sugar-candy-background-2475063097.jpg';

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          opacity: loading ? 0.7 : 1,
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* Stock Badge */}
        {(isOutOfStock || isLowStock) && (
          <Chip
            label={isOutOfStock ? 'Out of Stock' : 'Low Stock'}
            color={isOutOfStock ? 'error' : 'warning'}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 2,
              fontWeight: 600,
              boxShadow: 1,
            }}
          />
        )}

        {/* Sweet Image */}
        <CardMedia
          component="img"
          height="200"
          image={sweet.image || defaultImage}
          alt={sweet.name}
          sx={{
            objectFit: 'cover',
            filter: isOutOfStock ? 'grayscale(60%)' : 'none',
          }}
        />

        <CardContent sx={{ flex: 1, p: 2.5 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={sweet.category}
              size="small"
              color="primary"
              sx={{
                fontSize: '0.7rem',
                height: 22,
                borderRadius: '6px',
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Stock: {sweet.quantity}
            </Typography>
          </Box>

          {/* Sweet Name */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mt: 1,
              lineHeight: 1.3,
              fontSize: '1.2rem',
            }}
          >
            {sweet.name}
          </Typography>

          {/* Description */}
          {sweet.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 1.5 }}
            >
              {sweet.description}
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Price */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              mt: 1,
            }}
          >
            ${sweet.price?.toFixed(2)}
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={() => setPurchaseDialog(true)}
            disabled={isOutOfStock || loading}
            sx={{
              flex: 1,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </Button>

          {isAdmin && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Restock">
                <IconButton
                  size="small"
                  onClick={() => setRestockDialog(true)}
                  color="success"
                >
                  <Inventory />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(sweet)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => onDelete?.(sweet.id)}
                  color="error"
                >
                  <Delete />
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
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Purchase {sweet.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Available quantity: {sweet.quantity}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
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
              sx={{ width: 80 }}
              size="small"
            />
            <IconButton
              size="small"
              onClick={() =>
                setQuantity(Math.min(sweet.quantity, quantity + 1))
              }
              disabled={quantity >= sweet.quantity}
            >
              <Add />
            </IconButton>
          </Box>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
            Total: ${(sweet.price * quantity).toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePurchase}>
            Confirm Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      {isAdmin && (
        <Dialog
          open={restockDialog}
          onClose={() => setRestockDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 700 }}>
            Restock {sweet.name}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Current stock: {sweet.quantity}
            </Typography>
            <TextField
              fullWidth
              label="Quantity to Add"
              type="number"
              value={restockQuantity}
              onChange={(e) =>
                setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              inputProps={{ min: 1 }}
              size="small"
            />
            <Typography variant="body2" sx={{ mt: 1 }}>
              New total: {sweet.quantity + restockQuantity}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRestockDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleRestock}>
              Confirm Restock
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default SweetCard;
