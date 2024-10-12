import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Badge, Carousel } from 'react-bootstrap';
import axios from 'axios';
import '../styles/productDetails.css';
import LoggedInNavigationBar from './LoggedInNavigationBar'; // Import the Navbar

const LoggedDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error fetching product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Example function to handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality if needed
  };

  // Example function to handle cart update
  const handleCartUpdate = () => {
    // This is a placeholder. Update the cartItemCount based on your cart management logic
    setCartItemCount(prevCount => prevCount + 1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formattedPrice = product.price !== undefined
    ? product.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : 'N/A';

  return (
    <div>
      <LoggedInNavigationBar 
        onSearch={handleSearch} 
        cartItemCount={cartItemCount} 
      />
      <Container className="py-4">
        <Row>
          <Col md={6}>
            <Carousel className="product-carousel">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <Carousel.Item key={index}>
                    <Image 
                      src={`http://localhost:5000${img.image_url}`} 
                      alt={`${product.title} image ${index + 1}`} 
                      fluid 
                      className="product-image"
                      style={{ height: '100%', objectFit: 'cover' }} // Ensures the image covers the carousel item
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Image 
                  src={`http://localhost:5000${product.image}`} 
                  alt={product.title} 
                  fluid 
                  className="product-image"
                  style={{ height: '100%', objectFit: 'cover' }} // Ensures the image covers the carousel item
                />
              )}
            </Carousel>
          </Col>
          <Col md={6}>
            <div className="product-details">
              <h2>{product.title}</h2>
              <Badge pill variant="info">New Arrival</Badge>
              <h3 className="mt-3">{formattedPrice}</h3>
              <p className="my-3">{product.description}</p>
              <div className="mb-4">
                <Button 
                  onClick={() => {
                    addToCart(product);
                    handleCartUpdate(); // Update cart item count
                  }} 
                  variant="primary" 
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h4>Product Details</h4>
            <p>{product.details}</p>
          </Col>
        </Row>
        {/* Additional Images */}
        <Row className="my-4">
          <Col>
            <h4>Additional Images</h4>
            <Row>
              {product.images && product.images.length > 1 ? (
                product.images.slice(1).map((img, index) => (
                  <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-3">
                    <Image
                      src={`http://localhost:5000${img.image_url}`}
                      alt={`${product.title} additional image ${index + 1}`}
                      fluid
                      className="additional-image"
                    />
                  </Col>
                ))
              ) : (
                <p>No additional images available.</p>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoggedDetails;
