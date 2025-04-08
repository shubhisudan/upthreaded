import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const About = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" align="center" gutterBottom>
          About UpThreaded
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Connecting customers with skilled tailors
        </Typography>
      </motion.div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph>
                At UpThreaded, we aim to revolutionize the tailoring industry by
                connecting customers with talented tailors in their local area. Our
                platform makes custom clothing accessible, affordable, and
                convenient for everyone.
              </Typography>
              <Typography variant="body1">
                We believe that everyone deserves clothing that fits perfectly and
                expresses their unique style. By bridging the gap between customers
                and skilled artisans, we're preserving traditional craftsmanship
                while embracing modern technology.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Our Story
              </Typography>
              <Typography variant="body1" paragraph>
                UpThreaded was founded in 2023 by a group of passionate
                entrepreneurs who recognized the challenges faced by both tailors and
                customers in the custom clothing market.
              </Typography>
              <Typography variant="body1">
                What started as a small local initiative has grown into a
                comprehensive platform that serves communities across the country.
                We're proud to support local tailors and help them grow their
                businesses while providing customers with high-quality, custom-made
                clothing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Our Values
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quality Craftsmanship
                    </Typography>
                    <Typography variant="body2">
                      We prioritize exceptional workmanship and attention to detail
                      in every garment.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: theme.palette.secondary.main, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Community Support
                    </Typography>
                    <Typography variant="body2">
                      We're committed to supporting local tailors and helping them
                      thrive in a digital world.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ bgcolor: theme.palette.primary.dark, color: 'white' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sustainability
                    </Typography>
                    <Typography variant="body2">
                      We promote sustainable fashion through made-to-order clothing
                      that reduces waste and lasts longer.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 