import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './index.css'; // Import your CSS file for footer styles

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4} className="footer-section">
            <h5>About Us</h5>
            <p>This is LINK we link the world together and make life easy for everyone and we appreciate your feedback thanks</p>
          </Col>
          <Col md={4} className="footer-section">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={4} className="footer-section">
            <h5>Connect With Us</h5>
            <ul className="list-unstyled">
              <li><FontAwesomeIcon icon={faFacebook} /><a href="https://www.facebook.com"> Facebook</a></li>
              <li><FontAwesomeIcon icon={faTwitter} /><a href="https://www.twitter.com"> Twitter</a></li>
              <li><FontAwesomeIcon icon={faInstagram} /><a href="https://www.instagram.com"> Instagram</a></li>
            </ul>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col md={6}>
              <p>&copy; 2024 Your Company. All Rights Reserved.</p>
            </Col>
            <Col md={6} className="text-end">
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                <li className="list-inline-item"><a href="#">Terms of Use</a></li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
