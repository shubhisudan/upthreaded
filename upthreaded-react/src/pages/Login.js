import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  useTheme,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // For demo purposes, we'll use hardcoded credentials
      // In a real app, this would be an API call
      if (formData.email === 'user@example.com' && formData.password === 'password') {
        // Store authentication token and user type
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('userType', 'user');
        
        // Redirect to appropriate dashboard based on user type
        navigate('/user/dashboard');
      } else if (formData.email === 'tailor@example.com' && formData.password === 'password') {
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('userType', 'tailor');
        navigate('/tailor/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              Sign in to your account to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
              >
                Sign In
              </Button>
            </motion.div>

            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
              <Grid item>
                <Button
                  component={Link}
                  to="/signup"
                  color="primary"
                  variant="text"
                >
                  Create an account
                </Button>
              </Grid>
              <Grid item>
                <Button
                  component={Link}
                  to="/forgot-password"
                  color="primary"
                  variant="text"
                >
                  Forgot password?
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Demo Credentials:
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                User: user@example.com / password
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Tailor: tailor@example.com / password
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Login; 