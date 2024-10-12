import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/NavigationBar';
import LoggedInNavigationBar from './components/LoggedInNavigationBar';
import AdminNavbar from './components/AdminNavbar';
import Cart from './components/Cart';
import Notification from './components/Notification';
import AdminNot from './components/AdminNot';
import Dashboard from './components/Dashboard';
import LoggedDetails from './components/LoggedDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider, useUser } from './UserContext';
import Home from './components/Home';
import Footer from './components/Footer';
import './app.css';

const Layout = ({ children }) => {
  const { user } = useUser(); // Destructure user from useUser

  return (
    <>
      {user ? (user.isAdmin ? <AdminNavbar /> : <LoggedInNavigationBar />) : <NavigationBar />}
      {children}
    </>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    setNotification({
      message: `Added ${product.title} to cart`,
      variant: 'success',
    });
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <UserProvider>
      <Router>
        <Layout>
          {notification && (
            <Notification
              message={notification.message}
              variant={notification.variant}
              onClose={handleCloseNotification}
            />
          )}
          <Container style={{ marginTop: '56px' }}>
            <Routes>
              <Route path="/" element={<Home searchTerm={searchTerm} addToCart={addToCart} />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute admin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/notifications" element={<AdminNot />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/cart"
                element={<Cart cart={cart} removeFromCart={removeFromCart} />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard searchTerm={searchTerm} addToCart={addToCart} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <LoggedDetails addToCart={addToCart} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Layout>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
