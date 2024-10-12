import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import { useUser } from "../UserContext";
import Notification from "./Notification";
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notification, setNotification] = useState(null);
  const [visibleProductId, setVisibleProductId] = useState(null);
  const navigate = useNavigate();
  const { admin } = useUser();

  const categories = [
    { id: "1", name: "Phones" },
    { id: "2", name: "Power Banks" },
    { id: "3", name: "Laptops" },
    { id: "4", name: "Smart Watches" },
    { id: "5", name: "Headsets" }
  ];

  const fetchProducts = useCallback(
    (token) => {
      fetch("http://localhost:5000/admin/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch products");
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.products) {
            setProducts(data.products);
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          navigate("/admin/login");
        });
    },
    [navigate]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchProducts(token);
    }
  }, [fetchProducts, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setSelectedFiles([...selectedFiles, ...files]);
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category_id", newProduct.category_id);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("images", selectedFiles[i]);
    }

    fetch("http://localhost:5000/admin/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add product");
        }
        return response.json();
      })
      .then((data) => {
        setProducts([...products, data]);
        setNewProduct({ title: "", description: "", price: "", category_id: "" });
        setSelectedFiles([]);
        setNotification({
          message: "Product added successfully",
          variant: "success",
        });
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        setNotification({
          message: "Failed to add product",
          variant: "danger",
        });
      });
  };

  const handleDeleteProduct = (productId) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/admin/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete product");
        }
        return response.json();
      })
      .then(() => {
        setProducts(products.filter((product) => product.id !== productId));
        setNotification({
          message: "Product deleted successfully",
          variant: "success",
        });
        fetchProducts(token);
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        setNotification({
          message: "Failed to delete product",
          variant: "danger",
        });
      });
  };

  const toggleProductImages = (productId) => {
    setVisibleProductId(visibleProductId === productId ? null : productId);
  };

  return (
    <div className="container mt-5">
      <AdminNavbar />
      <h1 className="text-center mb-5">
        Welcome,{" "}
        <span className="text-primary">
          {admin ? admin.firstName : "Boss"}😉
        </span>
      </h1>
      {notification && (
        <Notification
          message={notification.message}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="card shadow-sm p-4 mb-5 bg-white rounded">
        <h2 className="text-center mb-4">Products Uploaded</h2>
        <ul className="list-group list-group-flush">
          {products.map((product, index) => (
            <li
              key={product.id}
              className="list-group-item d-flex flex-column"
            >
              <div className="product-info mb-3">
                <strong>
                  {index + 1}. {product.title}
                </strong>
                <button
                  className="btn btn-outline-info btn-sm mt-2"
                  onClick={() => toggleProductImages(product.id)}
                >
                  {visibleProductId === product.id
                    ? "Show less"
                    : "Show Details"}
                </button>
                <div
                  className={`image-container ${
                    visibleProductId === product.id
                      ? "slide-down mt-3"
                      : "slide-up"
                  }`}
                >
                  {product.images &&
                    product.images.length > 0 &&
                    product.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:5000${image.image_url}`}
                        alt={`${product.title} image ${idx + 1}`}
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "auto",
                          marginLeft: idx > 0 ? "10px" : "0",
                        }}
                      />
                    ))}
                </div>
                <div
                  className={`product-description ${
                    visibleProductId === product.id
                      ? "show-description"
                      : "hide-description"
                  } mt-2`}
                >
                  <p>{product.description}</p>
                </div>
              </div>
              <button
                className="btn btn-danger w-100"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card shadow-sm p-4 mb-5 bg-white rounded">
        <h2 className="text-center mb-4">Add Product</h2>
        <form onSubmit={handleAddProduct}>
          <div className="form-group mb-3">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={newProduct.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              name="category_id"
              value={newProduct.category_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="images">Images</label>
            <input
              type="file"
              className="form-control"
              id="images"
              name="images"
              multiple
              onChange={handleInputChange}
              required
            />
            <p className="text-muted mt-2">Maximum of 5 images</p>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
