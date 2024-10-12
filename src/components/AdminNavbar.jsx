import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../UserContext';
import './index.css';

const AdminNavbar = () => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const { logout } = useUser();

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
            to="/admin/dashboard"
            onClick={handleNavItemClick}
            className="gradient-text"
          >
            Admin Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} className="navb" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/admin/dashboard"
                onClick={handleNavItemClick}
                className={location.pathname === '/admin/dashboard' ? 'active' : ''}
              >
                Dashboard
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
              <Nav.Link
                as={Link}
                to="/admin/notifications"
                onClick={handleNavItemClick}
                className={location.pathname === '/admin/notifications' ? 'active' : ''}
              >
                Notifications
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-danger">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AdminNavbar;
