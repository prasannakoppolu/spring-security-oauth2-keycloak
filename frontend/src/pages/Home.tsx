import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Container,
  Paper,
} from '@mui/material';
import { ShoppingCart, TrendingUp, LocalShipping, Security } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { fetchFeaturedProducts } from '../store/slices/productSlice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts() as any);
  }, [dispatch]);

  const features = [
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Secure Payment',
      description: '100% secure payment processing',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Best Quality',
      description: 'Premium quality products',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        sx={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: 8,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to E-Commerce Store
          </Typography>
          <Typography variant="h6" paragraph>
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast shipping.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: 'white',
              color: '#667eea',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ mb: 2, color: 'primary.main' }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {featuredProducts.slice(0, 6).map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s',
                  },
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrls?.[0] || 'https://via.placeholder.com/300x200'}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {featuredProducts.length === 0 && !isLoading && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary">
              No featured products available
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;