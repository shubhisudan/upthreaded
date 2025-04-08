import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  EventNote as EventNoteIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample data for tailor requests
const mockRequests = [
  {
    id: 'REQ123456',
    customer: 'Ankit Sharma',
    date: '2023-04-10',
    service: 'Custom Suit',
    description:
      'I need a formal suit for a wedding. Preferably navy blue with modern cut.',
    status: 'New',
  },
  {
    id: 'REQ123455',
    customer: 'Priya Patel',
    date: '2023-04-09',
    service: 'Traditional Saree Blouse',
    description:
      'Need a blouse to match with my silk saree. I have attached the design.',
    status: 'New',
  },
  {
    id: 'REQ123454',
    customer: 'Rahul Gupta',
    date: '2023-04-08',
    service: 'Kurta Pajama Set',
    description: 'Traditional kurta pajama set for a family function.',
    status: 'Quoted',
    quoteAmount: '₹4,500',
  },
  {
    id: 'REQ123453',
    customer: 'Neha Singh',
    date: '2023-04-07',
    service: 'Cotton Shirts (3)',
    description: 'Three custom-fitted cotton shirts for office wear.',
    status: 'Declined',
    reason: 'Currently not taking bulk orders',
  },
];

const RequestStatusChip = ({ status }) => {
  let color;
  switch (status) {
    case 'New':
      color = 'primary';
      break;
    case 'Quoted':
      color = 'secondary';
      break;
    case 'Accepted':
      color = 'success';
      break;
    case 'Declined':
      color = 'error';
      break;
    default:
      color = 'default';
  }
  return <Chip label={status} color={color} size="small" />;
};

const RequestCard = ({ request, onQuote, onDecline }) => {
  const theme = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
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
                  {request.service}
                </Typography>
                <RequestStatusChip status={request.status} />
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Request ID: {request.id} • Received: {request.date}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <PersonIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.text.secondary }}
                />
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {request.customer}
                </Typography>
              </Box>
              <Typography variant="body1" paragraph>
                {request.description}
              </Typography>
              {request.status === 'Quoted' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.light,
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                  }}
                >
                  <MoneyIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Your quote: {request.quoteAmount}
                  </Typography>
                </Box>
              )}
              {request.status === 'Declined' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: theme.palette.error.light,
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">
                    Declined reason: {request.reason}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid
              item
              xs={12}
              md={5}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {request.status === 'New' && (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onQuote(request)}
                  >
                    Send Quote
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => onDecline(request)}
                  >
                    Decline
                  </Button>
                </Stack>
              )}
              {request.status === 'Quoted' && (
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Waiting for customer to accept quote
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TailorRequests = () => {
  const theme = useTheme();
  const [requests, setRequests] = useState(mockRequests);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [declineReason, setDeclineReason] = useState('');

  const handleQuoteOpen = (request) => {
    setSelectedRequest(request);
    setQuoteDialogOpen(true);
  };

  const handleQuoteClose = () => {
    setQuoteDialogOpen(false);
    setQuoteAmount('');
  };

  const handleDeclineOpen = (request) => {
    setSelectedRequest(request);
    setDeclineDialogOpen(true);
  };

  const handleDeclineClose = () => {
    setDeclineDialogOpen(false);
    setDeclineReason('');
  };

  const handleQuoteSubmit = () => {
    if (!quoteAmount.trim()) return;

    // Update the request status
    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id
        ? { ...req, status: 'Quoted', quoteAmount: `₹${quoteAmount}` }
        : req
    );
    setRequests(updatedRequests);
    handleQuoteClose();
  };

  const handleDeclineSubmit = () => {
    if (!declineReason.trim()) return;

    // Update the request status
    const updatedRequests = requests.map((req) =>
      req.id === selectedRequest.id
        ? { ...req, status: 'Declined', reason: declineReason }
        : req
    );
    setRequests(updatedRequests);
    handleDeclineClose();
  };

  // Filter active requests (New and Quoted)
  const activeRequests = requests.filter(
    (req) => req.status === 'New' || req.status === 'Quoted'
  );

  // Filter past requests (Accepted and Declined)
  const pastRequests = requests.filter(
    (req) => req.status === 'Accepted' || req.status === 'Declined'
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Customer Requests
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage incoming requests from customers
        </Typography>
      </motion.div>

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h5">Active Requests</Typography>
          <Chip
            label={`${activeRequests.length} Request(s)`}
            color="primary"
            variant="outlined"
          />
        </Box>

        {activeRequests.length > 0 ? (
          activeRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onQuote={handleQuoteOpen}
              onDecline={handleDeclineOpen}
            />
          ))
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No active requests at the moment
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {pastRequests.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Past Requests
          </Typography>

          {pastRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onQuote={handleQuoteOpen}
              onDecline={handleDeclineOpen}
            />
          ))}
        </Box>
      )}

      {/* Quote Dialog */}
      <Dialog open={quoteDialogOpen} onClose={handleQuoteClose}>
        <DialogTitle>Send Quote</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Sending quote for: {selectedRequest?.service}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {selectedRequest?.customer}
            </Typography>
          </Box>
          <TextField
            autoFocus
            label="Quote Amount (₹)"
            type="text"
            fullWidth
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            placeholder="e.g. 5,000"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleQuoteClose}>Cancel</Button>
          <Button onClick={handleQuoteSubmit} variant="contained">
            Send Quote
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onClose={handleDeclineClose}>
        <DialogTitle>Decline Request</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="body1">
              Declining request for: {selectedRequest?.service}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {selectedRequest?.customer}
            </Typography>
          </Box>
          <TextField
            autoFocus
            label="Reason for declining"
            fullWidth
            multiline
            rows={3}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Please provide a reason for declining this request"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineClose}>Cancel</Button>
          <Button onClick={handleDeclineSubmit} variant="contained" color="error">
            Decline Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TailorRequests; 