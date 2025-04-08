import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactsIcon from '@mui/icons-material/Contacts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LogoutIcon from '@mui/icons-material/Logout';
import { motion } from 'framer-motion';

const publicPages = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'About', path: '/about', icon: <InfoIcon /> },
  { name: 'Contact', path: '/contact', icon: <ContactsIcon /> },
];

const userPages = [
  { name: 'Dashboard', path: '/user/dashboard', icon: <DashboardIcon /> },
  { name: 'Profile', path: '/user/profile', icon: <PersonIcon /> },
  { name: 'Orders', path: '/user/orders', icon: <ShoppingBagIcon /> },
];

const tailorPages = [
  { name: 'Dashboard', path: '/tailor/dashboard', icon: <DashboardIcon /> },
  { name: 'Profile', path: '/tailor/profile', icon: <PersonIcon /> },
  { name: 'Requests', path: '/tailor/requests', icon: <ShoppingBagIcon /> },
  { name: 'Orders', path: '/tailor/orders', icon: <ShoppingBagIcon /> },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
    handleCloseUserMenu();
  };

  const getActivePages = () => {
    if (!isAuthenticated) return publicPages;
    switch (userType) {
      case 'user':
        return [...publicPages, ...userPages];
      case 'tailor':
        return [...publicPages, ...tailorPages];
      default:
        return publicPages;
    }
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {getActivePages().map((page) => (
          <ListItem
            key={page.name}
            component={Link}
            to={page.path}
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: isActive(page.path) ? theme.palette.primary.light + '20' : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
            }}
          >
            <ListItemIcon sx={{ color: isActive(page.path) ? theme.palette.primary.main : 'inherit' }}>
              {page.icon}
            </ListItemIcon>
            <ListItemText 
              primary={page.name} 
              sx={{ 
                color: isActive(page.path) ? theme.palette.primary.main : theme.palette.text.primary 
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: theme.palette.primary.main,
                textDecoration: 'none',
              }}
            >
              UpThreaded
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={handleDrawerToggle}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: theme.palette.primary.main,
              textDecoration: 'none',
            }}
          >
            UpThreaded
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {getActivePages().map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{
                  mx: 2,
                  color: isActive(page.path) ? theme.palette.primary.main : theme.palette.text.primary,
                  position: 'relative',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    '&::after': {
                      width: '100%',
                    },
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: isActive(page.path) ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease-in-out',
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <AccountCircle />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <Drawer
            variant="temporary"
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
            }}
          >
            {drawer}
            {!isAuthenticated && (
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: '20px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: '20px',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s',
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 