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
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ActionCard = ({ icon, title, description, to, color }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: color,
          color: 'white',
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                mr: 2,
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
            {description}
          </Typography>
          <Button
            component={Link}
            to={to}
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: 'white' },
            }}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UserDashboard = () => {
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
          Find the perfect tailor for your custom clothing needs
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <ActionCard
            icon={<SearchIcon sx={{ fontSize: 30, color: 'white' }} />}
            title="Find Tailors"
            description="Browse through our network of skilled tailors and find the perfect match for your needs."
            to="/tailors"
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            icon={<ShoppingCartIcon sx={{ fontSize: 30, color: 'white' }} />}
            title="My Orders"
            description="Track your current orders and view your order history."
            to="/user/orders"
            color={theme.palette.secondary.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActionCard
            icon={<PersonIcon sx={{ fontSize: 30, color: 'white' }} />}
            title="Profile"
            description="Manage your account settings and personal information."
            to="/user/profile"
            color={theme.palette.primary.dark}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" color="text.secondary" align="center">
              No recent activity to show
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UserDashboard; 