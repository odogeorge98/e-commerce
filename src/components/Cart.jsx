import React from 'react';
import { Container, Row, Col, Button, Image, Card } from 'react-bootstrap';
import LoggedInNavigationBar from './LoggedInNavigationBar';

const Cart = ({ cart, removeFromCart, onSearch, onNotifyAdmin, onProceedToPay }) => {
  const totalAmount = cart.reduce((acc, product) => acc + Number(product.price), 0);

  const handleAddToCart = (product) => {
    onNotifyAdmin(product);  // Notify admin about the product addition
  };

  return (
    <>
      <LoggedInNavigationBar />
      <Container className="mt-5 pt-5">
        <h1 className="mt-5 mb-4">Shopping Cart</h1>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((product, index) => (
              <Card className="mb-3" key={index}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={12} md={2} className="mb-3 mb-md-0">
                      <Image
                        src={`http://localhost:5000${product.images[0].image_url}`}
                        alt={product.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                      <h5>{product.name}</h5>
                      <p className="text-muted">{product.description}</p>
                    </Col>
                    <Col xs={12} md={2} className="mb-3 mb-md-0">
                      <h6 className="text-primary">${Number(product.price).toFixed(2)}</h6>
                    </Col>
                    <Col xs={12} md={2}>
                      <Button variant="danger" onClick={() => removeFromCart(index)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
            <Row className="mt-4">
              <Col className="text-right">
                <h4>Total Amount: <span className="text-success">${totalAmount.toFixed(2)}</span></h4>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col className="text-right">
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={onProceedToPay}
                >
                  Proceed to Pay
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;
