import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Pagination, Dropdown, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import NavigationBar from "./NavigationBar"; // Import your NavigationBar component
import './index.css';
import '../styles/productDetails.css';

const Home = ({ addToCart, searchTerm: parentSearchTerm }) => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm || "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchTerm(parentSearchTerm || "");
  }, [parentSearchTerm]);

  const filteredProducts = products.filter(
    (product) =>
      product &&
      product.title &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter ? product.category === filter : true)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "priceLowHigh") {
      return a.price - b.price;
    }
    if (sort === "priceHighLow") {
      return b.price - a.price;
    }
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
    } else {
      addToCart(product);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`); // Ensure this route matches your router setup
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Render NavigationBar with user state */}
      <NavigationBar />

      <Container>
        <div className="head">
          <h1 className="mt-5 mb-4 welcome" style={{ color: "black" }}>
            Welcome to LINK
          </h1>
        </div>

        {/* Billboard Section */}
        <div className="billboard">
          <div className="billboard-content">
            <h2>Special Offer!</h2>
            <p>Get 20% off on all electronics this week only!</p>
            <Button variant="light" href="/specials">Shop Now</Button>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <h2>Products</h2>
          <div className="d-flex align-items-center mt-3 mt-md-0 flex-wrap">
            <Dropdown className="me-2 mb-2 mb-md-0">
              <Dropdown.Toggle variant="outline-primary" id="dropdown-categories">
                {filter || "Categories"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilter("")}>All Categories</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter("electronics")}>Electronics</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter("fashion")}>Fashion</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="me-2 mb-2 mb-md-0">
              <Dropdown.Toggle variant="outline-primary" id="dropdown-sort">
                {sort === "" ? "Sort By" : sort === "priceLowHigh" ? "Price: Low to High" : "Price: High to Low"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSort("")}>None</Dropdown.Item>
                <Dropdown.Item onClick={() => setSort("priceLowHigh")}>Price: Low to High</Dropdown.Item>
                <Dropdown.Item onClick={() => setSort("priceHighLow")}>Price: High to Low</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <Row xs={2} sm={3} md={4} lg={6} className="g-3">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <Col key={product.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <Carousel>
                        {product.images.map((img, idx) => (
                          <Carousel.Item key={idx}>
                            <img
                              className="d-block w-100"
                              src={`http://localhost:5000${img.image_url}`}
                              alt={product.title}
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    ) : (
                      <Card.Img
                        variant="top"
                        src={`http://localhost:5000${product.image}`}
                        alt={product.title}
                        style={{ objectFit: 'cover', height: '200px' }}
                      />
                    )}
                    <Card.Title className="mt-2">{product.title}</Card.Title>
                    <Card.Text>${product.price}</Card.Text>
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from bubbling up to Card.Body
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No products available.</p>
          )}
        </Row>

        <div className="d-flex justify-content-center mt-4">
          <Pagination className="justify-content-center mt-4">
            {Array.from({ length: Math.ceil(sortedProducts.length / productsPerPage) }, (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </Container>
    </>
  );
};

export default Home;
