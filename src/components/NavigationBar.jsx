import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import { FaShoppingCart } from 'react-icons/fa';
import './index.css';

const NavigationBar = ({ onSearch }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { user, isAdmin, logout } = useUser();
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
            to={user ? (isAdmin ? '/admin/dashboard' : '/dashboard') : '/'}
            onClick={handleNavItemClick}
            className="gradient-text"
          >
            LINK
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} className="navb" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAdmin && user ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard"
                    onClick={handleNavItemClick}
                    className={location.pathname === '/admin/dashboard' ? 'active' : ''}
                  >
                    Admin Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/products"
                    onClick={handleNavItemClick}
                    className={location.pathname === '/admin/products' ? 'active' : ''}
                  >
                    Manage Products
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/orders"
                    onClick={handleNavItemClick}
                    className={location.pathname === '/admin/orders' ? 'active' : ''}
                  >
                    Manage Orders
                  </Nav.Link>
                  <Nav.Link onClick={handleLogout} className="text-danger">
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
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
                  {!user && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/login' ? 'active' : ''}
                      >
                        Login
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/register"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/register' ? 'active' : ''}
                      >
                        Register
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/admin/login"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/admin/login' ? 'active' : ''}
                      >
                        Admin Login
                      </Nav.Link>
                    </>
                  )}
                  {user && !isAdmin && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/dashboard"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/dashboard' ? 'active' : ''}
                      >
                        Dashboard
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/cart"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/cart' ? 'active' : ''}
                      >
                        <FaShoppingCart style={{ marginRight: '5px', fontSize: '1.2rem' }} /> {/* Ensure the icon is visible */}
                        Cart
                      </Nav.Link>
                      <Nav.Link onClick={handleLogout} className="text-danger">
                        Logout
                      </Nav.Link>
                    </>
                  )}
                  {!user && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/login"
                        onClick={handleNavItemClick}
                        className={location.pathname === '/cart' ? 'active' : ''}
                      >
                        Cart
                        <FaShoppingCart /> {/* Cart icon */}
                      </Nav.Link>
                    </>
                  )}
                </>
              )}
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

export default NavigationBar;
