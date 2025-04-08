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
  LinearProgress,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample order data
const mockOrders = [
  {
    id: 'ORD123456',
    date: '2023-04-01',
    tailor: 'Rohit Sharma',
    items: 'Custom Suit (Navy Blue)',
    status: 'In Progress',
    completionPercentage: 60,
    total: '₹12,500',
  },
  {
    id: 'ORD123455',
    date: '2023-03-15',
    tailor: 'Ananya Patel',
    items: 'Wedding Sherwani (Maroon)',
    status: 'Ready for Pickup',
    completionPercentage: 100,
    total: '₹25,000',
  },
  {
    id: 'ORD123454',
    date: '2023-02-20',
    tailor: 'Vikram Singh',
    items: 'Formal Shirt (White) x2',
    status: 'Delivered',
    completionPercentage: 100,
    total: '₹4,000',
  },
  {
    id: 'ORD123453',
    date: '2023-01-10',
    tailor: 'Rohit Sharma',
    items: 'Business Casual Pants (Black)',
    status: 'Delivered',
    completionPercentage: 100,
    total: '₹3,500',
  },
];

const StatusChip = ({ status }) => {
  let color = 'default';
  switch (status) {
    case 'In Progress':
      color = 'primary';
      break;
    case 'Ready for Pickup':
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

const OrderCard = ({ order }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
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
                Ordered on: {order.date}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="body1">{order.items}</Typography>
              <Typography variant="body2" color="text.secondary">
                Tailor: {order.tailor}
              </Typography>
              {order.status === 'In Progress' && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">
                      {order.completionPercentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={order.completionPercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              sm={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'flex-end' },
              }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
              >
                {order.total}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mt: { xs: 2, sm: 0 },
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<MessageIcon />}
                >
                  Message
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UserOrders = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter orders based on tab selection
  const filteredOrders = () => {
    switch (tabValue) {
      case 0: // All Orders
        return mockOrders;
      case 1: // Active Orders
        return mockOrders.filter(
          (order) =>
            order.status === 'In Progress' || order.status === 'Ready for Pickup'
        );
      case 2: // Completed Orders
        return mockOrders.filter((order) => order.status === 'Delivered');
      default:
        return mockOrders;
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
          Track and manage your orders
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
            <OrderCard key={order.id} order={order} />
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
    </Container>
  );
};

export default UserOrders; 