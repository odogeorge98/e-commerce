import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import the cart icon
import './index.css';

const LoggedInNavigationBar = ({ onSearch, cartItemCount }) => {
  const location = useLocation();
  const { isAdmin, logout } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term); // Pass search term up to parent component
  };

  const handleNavItemClick = () => {
    setExpanded(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <div className="navb">
      <Navbar expand="lg" expanded={expanded} fixed="top" className="nav1">
        <Container>
          <Navbar.Brand
            as={Link}
            to={isAdmin ? '/admin/dashboard' : '/dashboard'}
            onClick={handleNavItemClick}
            className="gradient-text"
          >
            LINK
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} className="navb" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Category" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/category/phones" onClick={handleNavItemClick}>
                  Phones
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/watches" onClick={handleNavItemClick}>
                  Watches
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/category/power-banks" onClick={handleNavItemClick}>
                  Power Banks
                </NavDropdown.Item>
              </NavDropdown>
              {isAdmin && (
                <Nav.Link
                  as={Link}
                  to="/admin/dashboard"
                  onClick={handleNavItemClick}
                  className={location.pathname === '/admin/dashboard' ? 'active' : ''}
                >
                  Admin Dashboard
                </Nav.Link>
              )}
              <Nav.Link
                as={Link}
                to="/cart"
                onClick={handleNavItemClick}
                className={location.pathname === '/cart' ? 'active' : ''}
              >
                
                {cartItemCount > 0 && (
                  <span className="cart-counter">{cartItemCount}</span> // Display cart item count
                )}
                Cart
                <FaShoppingCart /> {/* Cart icon */}
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-danger">
                Logout
              </Nav.Link>
            </Nav>
            <Form className="d-flex">
              <FormControl
                type="text"
                placeholder="Search products..."
                className="me-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default LoggedInNavigationBar;
