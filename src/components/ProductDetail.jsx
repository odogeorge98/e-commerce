import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Badge, Carousel, Navbar, Nav } from 'react-bootstrap';
import axios from 'axios';
import '../styles/productDetails.css';

const ProductDetail = ({ addToCart, isLoggedIn }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const formattedPrice = product.price !== undefined
    ? product.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    : 'N/A';

  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Product Detail Content */}
      <Container className="py-4">
        <Row>
          <Col md={6}>
            <Carousel className="product-carousel">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, index) => (
                  <Carousel.Item key={index}>
                    <Image src={`http://localhost:5000${img.image_url}`} alt={`${product.title} image ${index + 1}`} fluid className="product-image" />
                  </Carousel.Item>
                ))
              ) : (
                <Image src={`http://localhost:5000${product.image}`} alt={product.title} fluid className="product-image" />
              )}
            </Carousel>
          </Col>
          <Col md={6}>
            <div className="product-details">
              <h2>{product.title}</h2>
              <Badge pill variant="info">New Arrival</Badge>
              <h3 className="mt-3"> {formattedPrice}</h3>
              <p className="my-3">{product.description}</p>
              <div className="mb-4">
                {isLoggedIn ? (
                  <Button onClick={() => addToCart(product)} variant="primary" className="add-to-cart-btn">
                    Add to Cart
                  </Button>
                ) : (
                  <Button variant="primary" disabled className="add-to-cart-btn">
                    Please log in to add to cart
                  </Button>
                )}
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
    </>
  );
};

export default ProductDetail;
