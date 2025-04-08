import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';
import theme from './theme';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TailorDashboard from './pages/TailorDashboard';
import TailorProfile from './pages/TailorProfile';
import TailorRequests from './pages/TailorRequests';
import TailorOrders from './pages/TailorOrders';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';

const globalStyles = {
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'html, body': {
    minHeight: '100vh',
    scrollBehavior: 'smooth',
  },
  body: {
    lineHeight: 1.6,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  a: {
    textDecoration: 'none',
    color: 'inherit',
  },
  'img, picture, video, canvas, svg': {
    display: 'block',
    maxWidth: '100%',
  },
};

// Protected Route component
const ProtectedRoute = ({ children, userType }) => {
  // Replace this with your actual authentication logic
  const isAuthenticated = localStorage.getItem('token');
  const currentUserType = localStorage.getItem('userType');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userType && currentUserType !== userType) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={globalStyles} />
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Tailor Routes */}
          <Route path="/tailor/*" element={
            <ProtectedRoute userType="tailor">
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<TailorDashboard />} />
                <Route path="profile" element={<TailorProfile />} />
                <Route path="requests" element={<TailorRequests />} />
                <Route path="orders" element={<TailorOrders />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="/user/*" element={
            <ProtectedRoute userType="user">
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="orders" element={<UserOrders />} />
              </Routes>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
