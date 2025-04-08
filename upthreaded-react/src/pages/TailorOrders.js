import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Update as UpdateIcon,
  Done as DoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample orders data
const mockOrders = [
  {
    id: 'ORD789123',
    customer: 'Rahul Mehta',
    date: '2023-04-05',
    items: 'Wedding Sherwani (Maroon)',
    status: 'In Progress',
    progress: 40,
    dueDate: '2023-05-15',
    amount: '₹22,000',
    paid: '₹11,000',
    remaining: '₹11,000',
    deliveryAddress: '123 Wedding Hall, Mumbai',
  },
  {
    id: 'ORD789122',
    customer: 'Anjali Sharma',
    date: '2023-04-03',
    items: 'Formal Dress (Blue)',
    status: 'In Progress',
    progress: 75,
    dueDate: '2023-04-20',
    amount: '₹8,500',
    paid: '₹5,000',
    remaining: '₹3,500',
    deliveryAddress: '456 Office Complex, Delhi',
  },
  {
    id: 'ORD789121',
    customer: 'Deepak Verma',
    date: '2023-03-25',
    items: 'Business Suit (Black)',
    status: 'Ready for Delivery',
    progress: 100,
    dueDate: '2023-04-10',
    amount: '₹16,000',
    paid: '₹16,000',
    remaining: '₹0',
    deliveryAddress: '789 Corporate Plaza, Bangalore',
  },
  {
    id: 'ORD789120',
    customer: 'Priya Malhotra',
    date: '2023-03-15',
    items: 'Lehenga (Red)',
    status: 'Delivered',
    progress: 100,
    dueDate: '2023-04-01',
    deliveryDate: '2023-03-30',
    amount: '₹35,000',
    paid: '₹35,000',
    remaining: '₹0',
    deliveryAddress: '101 Celebration Hall, Chennai',
  },
];

const StatusChip = ({ status }) => {
  let color;
  switch (status) {
    case 'In Progress':
      color = 'primary';
      break;
    case 'Ready for Delivery':
      color = 'secondary';
      break;
    case 'Delivered':
      color = 'success';
      break;
    case 'Cancelled':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  return <Chip label={status} color={color} size="small" />;
};

const OrderCard = ({ order, onUpdateStatus, onMarkDelivered }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 3, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  mb: 1,
                }}
              >
                <Typography variant="h6" component="div">
                  {order.id}
                </Typography>
                <StatusChip status={order.status} />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Ordered on: {order.date} • Due: {order.dueDate}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {order.items}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {order.customer}
                  </Typography>
                </Box>
              </Box>

              {order.status !== 'Delivered' && (
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{order.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={order.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {order.amount}
                  </Typography>
                </Box>
                {order.remaining !== '₹0' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Remaining
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: theme.palette.error.main }}
                    >
                      {order.remaining}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {order.status === 'In Progress' && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<UpdateIcon />}
                  onClick={() => onUpdateStatus(order)}
                  sx={{ mb: 2 }}
                >
                  Update Progress
                </Button>
              )}
              {order.status === 'Ready for Delivery' && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DoneIcon />}
                  onClick={() => onMarkDelivered(order)}
                  sx={{ mb: 2 }}
                >
                  Mark as Delivered
                </Button>
              )}
              <Button
                variant="outlined"
                size="small"
                startIcon={<MessageIcon />}
                sx={{ mt: 1 }}
              >
                Message Customer
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TailorOrders = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateOpen = (order) => {
    setSelectedOrder(order);
    setProgress(order.progress);
    setStatus(order.status);
    setUpdateDialogOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateDialogOpen(false);
  };

  const handleDeliverOpen = (order) => {
    setSelectedOrder(order);
    setDeliverDialogOpen(true);
  };

  const handleDeliverClose = () => {
    setDeliverDialogOpen(false);
  };

  const handleUpdateSubmit = () => {
    // Update order progress and potentially status
    const newStatus = progress === 100 ? 'Ready for Delivery' : 'In Progress';
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? { ...order, progress, status: newStatus }
        : order
    );
    setOrders(updatedOrders);
    handleUpdateClose();
  };

  const handleDeliverSubmit = () => {
    // Mark order as delivered
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: 'Delivered',
            deliveryDate: new Date().toISOString().split('T')[0],
          }
        : order
    );
    setOrders(updatedOrders);
    handleDeliverClose();
  };

  // Filter orders based on tab selection
  const filteredOrders = () => {
    switch (tabValue) {
      case 0: // All Orders
        return orders;
      case 1: // Active Orders
        return orders.filter(
          (order) =>
            order.status === 'In Progress' ||
            order.status === 'Ready for Delivery'
        );
      case 2: // Completed Orders
        return orders.filter((order) => order.status === 'Delivered');
      default:
        return orders;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and track customer orders
        </Typography>
      </motion.div>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="orders tabs"
        >
          <Tab label="All Orders" />
          <Tab label="Active Orders" />
          <Tab label="Completed Orders" />
        </Tabs>
      </Box>

      <Box>
        {filteredOrders().length > 0 ? (
          filteredOrders().map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateOpen}
              onMarkDelivered={handleDeliverOpen}
            />
          ))
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You don't have any orders in this category yet
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Update Progress Dialog */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Order Progress</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Updating: {selectedOrder?.items}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {selectedOrder?.id}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Completion Percentage</InputLabel>
            <Select
              value={progress}
              label="Completion Percentage"
              onChange={(e) => setProgress(e.target.value)}
            >
              <MenuItem value={10}>10% - Just Started</MenuItem>
              <MenuItem value={25}>25% - Initial Work Done</MenuItem>
              <MenuItem value={50}>50% - Halfway Complete</MenuItem>
              <MenuItem value={75}>75% - Almost Done</MenuItem>
              <MenuItem value={100}>100% - Ready for Delivery</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Notes (optional)"
            margin="normal"
            placeholder="Add any notes or updates for the customer"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Cancel</Button>
          <Button onClick={handleUpdateSubmit} variant="contained">
            Update Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mark as Delivered Dialog */}
      <Dialog
        open={deliverDialogOpen}
        onClose={handleDeliverClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mark Order as Delivered</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Deliver: {selectedOrder?.items}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To: {selectedOrder?.customer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {selectedOrder?.deliveryAddress}
            </Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Delivery Notes (optional)"
            margin="normal"
            placeholder="Add any delivery notes or instructions"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeliverClose}>Cancel</Button>
          <Button
            onClick={handleDeliverSubmit}
            variant="contained"
            color="success"
          >
            Confirm Delivery
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TailorOrders; 