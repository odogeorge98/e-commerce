const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require('dotenv').config(); // Add environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "Georgos_21"; 
// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rocketpower",
  database: process.env.DB_NAME || "ecommerce_db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with failure
  }
  console.log("Connected to MySQL database");
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
  }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// User Registration
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const userExistsQuery = "SELECT email FROM users WHERE email = ?";
    db.query(userExistsQuery, [email], async (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).send("Failed to register user");
      }
      if (result.length > 0) {
        return res.status(400).send("Email already in use");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
      db.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Failed to register user:", err);
          res.status(500).send("Failed to register user");
        } else {
          console.log("User registered successfully");
          res.status(200).send("User registered successfully");
        }
      });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Failed to register user");
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Failed to login:", err);
        res.status(500).send("Failed to login");
      } else {
        if (result.length > 0) {
          const isMatch = await bcrypt.compare(password, result[0].password);
          if (isMatch) {
            res.status(200).json({ message: "Login successful", user: result[0] });
          } else {
            res.status(400).send("Password incorrect");
          }
        } else {
          res.status(400).send("User not found");
        }
      }
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Failed to login");
  }
});

// Admin Registration
app.post("/admin/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if admin already exists
    const adminExistsQuery = "SELECT email FROM admins WHERE email = ?";
    db.query(adminExistsQuery, [email], async (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Failed to check admin existence" });
      }
      if (result.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = "INSERT INTO admins (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
      db.query(sql, [firstName, lastName, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Failed to register admin:", err);
          return res.status(500).json({ message: "Failed to register admin" });
        }
        console.log("Admin registered successfully");
        return res.status(201).json({ message: "Admin registered successfully" });
      });
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



// Admin Login
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM admins WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
      if (err) {
        console.error("Failed to login admin:", err);
        res.status(500).send("Failed to login admin");
      } else {
        if (result.length > 0) {
          const isMatch = await bcrypt.compare(password, result[0].password);
          if (isMatch) {
            const token = jwt.sign({ id: result[0].id }, JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: "Login successful", token });
          } else {
            res.status(400).send("Password incorrect");
          }
        } else {
          res.status(400).send("Admin not found");
        }
      }
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).send("Failed to login admin");
  }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Dashboard
app.get("/dashboard", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const userSql = "SELECT firstName FROM users WHERE email = ?";
  const productsSql = "SELECT * FROM products";

  db.query(userSql, [email], (err, userResult) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ message: "Error fetching user data" });
    }

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    db.query(productsSql, (err, productsResult) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Error fetching products" });
      }

      res.status(200).json({
        user: userResult[0],
        products: productsResult,
      });
    });
  });
});

// Admin Dashboard
app.get("/admin/dashboard", authenticateToken, (req, res) => {
  const admin_id = req.user.id; // Extract admin ID from authenticated user
  const productsSql = "SELECT * FROM products WHERE admin_id = ?";

  db.query(productsSql, [admin_id], (err, productsResult) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ message: "Error fetching products" });
    }

    res.status(200).json({ products: productsResult });
  });
});

// Create Product (Admin Only) with Multiple Image Uploads
app.post("/admin/products", authenticateToken, upload.array('images', 5), (req, res) => {
  const { title, description, price } = req.body;
  const admin_id = req.user.id; // Extract admin ID from authenticated user
  const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

  const productSql = "INSERT INTO products (title, description, price, admin_id) VALUES (?, ?, ?, ?)";
  db.query(productSql, [title, description, price, admin_id], (err, result) => {
    if (err) {
      console.error("Failed to add product:", err);
      return res.status(500).send({ error: "Failed to add product" });
    } 
    const productId = result.insertId;

    const imageSql = "INSERT INTO product_images (product_id, image_url) VALUES ?";
    const imageValues = imagePaths.map((path) => [productId, path]);

    db.query(imageSql, [imageValues], (err, imageResult) => {
      if (err) {
        console.error("Failed to add product images:", err);
        return res.status(500).send({ error: "Failed to add product images" });
      }
      console.log("Product and images added successfully");
      res.status(200).json({ message: "Product and images added successfully", productId });
    });
  });
});


// Delete Product by ID (Admin Only)
app.delete("/admin/products/:productId", authenticateToken, (req, res) => {
  const productId = req.params.productId;

  const productSql = "DELETE FROM products WHERE id = ?";
  const imagesSql = "DELETE FROM product_images WHERE product_id = ?";

  db.query(imagesSql, [productId], (err, imageResult) => {
    if (err) {
      console.error("Failed to delete product images:", err);
      return res.status(500).send({ error: "Failed to delete product images" });
    }

    db.query(productSql, [productId], (err, productResult) => {
      if (err) {
        console.error("Failed to delete product:", err);
        return res.status(500).send({ error: "Failed to delete product" });
      }
      console.log("Product deleted successfully");
      res.status(200).json({ message: "Product deleted successfully" });
    });
  });
});

// Get All Products
app.get('/products', (req, res) => {
  const productsSql = 'SELECT * FROM products';
  const imagesSql = 'SELECT * FROM product_images WHERE product_id = ?';

  db.query(productsSql, (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Error fetching products' });
    }

    const productPromises = products.map(product => {
      return new Promise((resolve, reject) => {
        db.query(imagesSql, [product.id], (err, images) => {
          if (err) {
            reject(err);
          } else {
            product.images = images;
            resolve(product);
          }
        });
      });
    });

    Promise.all(productPromises)
      .then(productsWithImages => {
        res.status(200).json(productsWithImages);
      })
      .catch(error => {
        console.error('Error fetching product images:', error);
        res.status(500).json({ message: 'Error fetching product images' });
      });
  });
});

// Get Product by ID
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  const productSql = 'SELECT * FROM products WHERE id = ?';
  const imagesSql = 'SELECT * FROM product_images WHERE product_id = ?';

  db.query(productSql, [productId], (err, products) => {
    if (err) {
      console.error('Error fetching product:', err);
      return res.status(500).json({ message: 'Error fetching product' });
    }
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    db.query(imagesSql, [productId], (err, images) => {
      if (err) {
        console.error('Error fetching product images:', err);
        return res.status(500).json({ message: 'Error fetching product images' });
      }

      const product = products[0];
      product.images = images;
      res.status(200).json(product);
    });
  });
});

// Create Category
app.post("/admin/categories", authenticateToken, (req, res) => {
    const { name } = req.body;
  
    const sql = "INSERT INTO categories (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error("Failed to add category:", err);
        return res.status(500).send({ error: "Failed to add category" });
      }
      res.status(201).json({ message: "Category added successfully" });
    });
  });
  
  // Get All Categories
  app.get("/categories", (req, res) => {
    const sql = "SELECT * FROM categories";
  
    db.query(sql, (err, result) => {
      if (err) {
        console.error("Failed to fetch categories:", err);
        return res.status(500).send({ error: "Failed to fetch categories" });
      }
      res.status(200).json(result);
    });
  });
  
  // Update Category by ID
  app.put("/admin/categories/:id", authenticateToken, (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
  
    const sql = "UPDATE categories SET name = ? WHERE id = ?";
    db.query(sql, [name, categoryId], (err, result) => {
      if (err) {
        console.error("Failed to update category:", err);
        return res.status(500).send({ error: "Failed to update category" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category updated successfully" });
    });
  });
  
  // Delete Category by ID
  app.delete("/admin/categories/:id", authenticateToken, (req, res) => {
    const categoryId = req.params.id;
  
    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [categoryId], (err, result) => {
      if (err) {
        console.error("Failed to delete category:", err);
        return res.status(500).send({ error: "Failed to delete category" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    });
  });
  

// Get Products (with optional category filter)
app.get("/products", (req, res) => {
  const category = req.query.category;
  let sql = "SELECT * FROM products";

  if (category) {
    sql += " WHERE category = ?";
  }

  db.query(sql, [category], (err, result) => {
    if (err) {
      console.error("Failed to fetch products:", err);
      return res.status(500).send({ error: "Failed to fetch products" });
    }
    res.status(200).json(result);
  });
});



// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
