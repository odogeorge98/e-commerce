import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import {
  Button,
  Card,
  Col,
  Row,
  Pagination,
  Carousel,
  Dropdown,
} from "react-bootstrap";
import "react-notifications/lib/notifications.css";
import LoggedInNavigationBar from "./LoggedInNavigationBar";
import '../styles/productDetails.css';

const Dashboard = ({ searchTerm: parentSearchTerm, addToCart }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories] = useState([
    { id: "1", name: "Phones" },
    { id: "2", name: "Power Banks" },
    { id: "3", name: "Laptops" },
    { id: "4", name: "Smart Watches" },
    { id: "5", name: "Headsets" }
  ]); // Hardcoded categories
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm || "");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetching products from backend
        const url = `http://localhost:5000/products${filter ? `?category=${filter}` : ""}`;
        console.log("Fetching URL:", url); // Debugging line
        const productsResponse = await fetch(url);
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsResponse.json();
        console.log("Products Data:", productsData); // Debugging line
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        NotificationManager.error("Failed to fetch dashboard data");
        setError(error.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [filter, navigate]);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product);
    NotificationManager.success(`${product.title} added to cart`);
  };

  useEffect(() => {
    setSearchTerm(parentSearchTerm || "");
  }, [parentSearchTerm]);

  const handleLocalSearch = (term) => {
    setSearchTerm(term || "");
  };

  const filteredProducts = products.filter(
    (product) =>
      product &&
      product.title &&
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter ? product.category === filter : true)
  );

  const sortProducts = (products, sort) => {
    switch (sort) {
      case "priceLowHigh":
        return [...products].sort((a, b) => a.price - b.price);
      case "priceHighLow":
        return [...products].sort((a, b) => b.price - a.price);
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(filteredProducts, sort);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilter = (category) => {
    console.log("Selected Category:", category); // Debugging line
    setFilter(category);
  };

  const handleSort = (sortOption) => {
    setSort(sortOption);
  };

  return (
    <>
      <LoggedInNavigationBar onSearch={handleLocalSearch} />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h1>
            Welcome,{" "}
            <span className="name">
              {user ? user.firstName : "Loading..."}😉
            </span>
          </h1>
        </div>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          user && (
            <>
              <div className="billboard">
                <div className="billboard-content">
                  <h2>Special Offer!</h2>
                  <p>Get 20% off on all electronics this week only!</p>
                  <Button variant="light" href="/specials">Shop Now</Button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center my-4">
                
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {filter || "All Categories"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleFilter("")}>All Categories</Dropdown.Item>
                    {categories.map((category) => (
                      <Dropdown.Item key={category.id} onClick={() => handleFilter(category.name)}>
                        {category.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {sort === "" ? "Sort by" : sort === "priceLowHigh" ? "Price: Low to High" : "Price: High to Low"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleSort("")}>Default</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSort("priceLowHigh")}>Price: Low to High</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSort("priceHighLow")}>Price: High to Low</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <h3 className="my-4">Products</h3>
              <Row xs={2} sm={3} md={4} lg={6} className="g-3">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <Col key={product.id}>
                      <Card className="h-100 shadow-sm product-card">
                        <Link to={`/products/${product.id}`}>
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
                              style={{ height: '200px', objectFit: 'cover' }}
                            />
                          )}
                        </Link>
                        <Card.Body className="d-flex flex-column justify-content-between text-center">
                          <div className="d-flex flex-column">
                            <Card.Title className="mb-2">{product.title}</Card.Title>
                            <Card.Text className="text-muted mt-2">${product.price}</Card.Text>
                          </div>
                          <Button
                            variant="primary"
                            className="mt-2"
                            size="sm"
                            onClick={() => handleAddToCart(product)}
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
                  {Array.from(
                    {
                      length: Math.ceil(
                        sortedProducts.length / productsPerPage
                      ),
                    },
                    (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    )
                  )}
                </Pagination>
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default Dashboard;
