import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const AdminRegister = () => {
  const [admin, setAdmin] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admin),
      });
      const data = await response.json();

      if (response.ok) {
        navigate('/admin/login');
      } else {
        // Use data.message to show the correct error message
        setError(data.message || 'Failed to register');
      }
    } catch (error) {
      setError('Failed to register');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Col md={6}>
          <h1>Admin Register</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="firstName">
              <Form.Control
                type="text"
                name="firstName"
                placeholder="First Name"
                value={admin.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName" className="mt-3">
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={admin.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Control
                type="email"
                name="email"
                placeholder="Email"
                value={admin.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="password" className="mt-3">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={admin.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button type="submit" className="mt-3">Register</Button>
          </Form>
        </Col>
        <Col md={6}>
          <img src="/images/signup-background.svg" alt="Admin Register" className="img-fluid" />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegister;
