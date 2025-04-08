import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card sx={{ height: '100%', bgcolor: color }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Typography variant="h6" sx={{ ml: 1, color: 'white' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, to, color }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        component={Link}
        to={to}
        variant="contained"
        color={color}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          height: '100%',
          minHeight: 150,
        }}
      >
        <Box sx={{ fontSize: 40 }}>{icon}</Box>
        <Typography variant="h6">{label}</Typography>
      </Button>
    </motion.div>
  );
};

const TailorDashboard = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your profile, requests, and orders all in one place.
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Pending Requests"
            value="5"
            icon={<AssignmentIcon sx={{ color: 'white', fontSize: 30 }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Active Orders"
            value="3"
            icon={<ShoppingCartIcon sx={{ color: 'white', fontSize: 30 }} />}
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Completed Orders"
            value="12"
            icon={<PersonIcon sx={{ color: 'white', fontSize: 30 }} />}
            color={theme.palette.primary.dark}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <ActionButton
            icon={<PersonIcon />}
            label="Edit Profile"
            to="/tailor/profile"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionButton
            icon={<AssignmentIcon />}
            label="View Requests"
            to="/tailor/requests"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionButton
            icon={<ShoppingCartIcon />}
            label="Manage Orders"
            to="/tailor/orders"
            color="primary"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TailorDashboard; 