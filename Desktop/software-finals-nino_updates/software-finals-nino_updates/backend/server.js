const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all localhost origins during development
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "mySql2025!",
  database: "paldo_foods",
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

function createSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function getCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const cookieArray = cookies.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookieArray) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }

  return null;
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  try {
    const connection = await getConnection();

    const [users] = await connection.execute(
      "SELECT user_id, username, email, password_hash, role FROM users WHERE username = ? OR email = ? LIMIT 1",
      [username, username]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      await connection.end();
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const sessionId = createSessionId();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await connection.execute(
      "INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)",
      [sessionId, user.user_id, expiresAt]
    );

    await connection.end();

    res.setHeader(
      "Set-Cookie",
      `session_id=${sessionId}; HttpOnly; Path=/; Max-Age=86400; SameSite=None; Secure`
    );
    
    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

app.post("/api/logout", async (req, res) => {
  const sessionId = getCookie(req, "session_id");

  if (!sessionId) {
    return res.json({
      success: true,
      message: "Already logged out.",
    });
  }

  try {
    const connection = await getConnection();

    await connection.execute("DELETE FROM sessions WHERE session_id = ?", [
      sessionId,
    ]);

    await connection.end();

    res.setHeader(
      "Set-Cookie",
      "session_id=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
    );

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

app.get("/api/check-session", async (req, res) => {
  const sessionId = getCookie(req, "session_id");

  if (!sessionId) {
    return res.status(401).json({
      loggedIn: false,
      message: "No active session.",
    });
  }

  try {
    const connection = await getConnection();

    const [sessions] = await connection.execute(
      `SELECT 
        sessions.session_id,
        sessions.expires_at,
        users.user_id,
        users.username,
        users.email,
        users.role
      FROM sessions
      JOIN users ON sessions.user_id = users.user_id
      WHERE sessions.session_id = ? AND sessions.expires_at > NOW()
      LIMIT 1`,
      [sessionId]
    );

    await connection.end();

    if (sessions.length === 0) {
      return res.status(401).json({
        loggedIn: false,
        message: "Session expired or invalid.",
      });
    }

    const session = sessions[0];

    return res.json({
      loggedIn: true,
      user: {
        user_id: session.user_id,
        username: session.username,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);

    return res.status(500).json({
      loggedIn: false,
      message: "Server error.",
    });
  }
});

// backend/server.js

app.get("/api/cart", async (req, res) => {
  const sessionId = getCookie(req, "session_id");
  if (!sessionId) return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await getConnection();
    
    // Get user from session
    const [sessions] = await connection.execute(
      "SELECT user_id FROM sessions WHERE session_id = ? AND expires_at > NOW()", 
      [sessionId]
    );
    
    if (sessions.length === 0) return res.status(401).json({ message: "Invalid session" });
    const userId = sessions[0].user_id;

    // Get cart items joined with product names/prices
    const [cartItems] = await connection.execute(
      `SELECT c.cart_id, c.product_id, p.name, p.price, c.quantity 
       FROM cart c 
       JOIN products p ON c.product_id = p.product_id 
       WHERE c.user_id = ?`,
      [userId]
    );

    await connection.end();
    res.json({ success: true, cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  const sessionId = getCookie(req, "session_id");
  if (!sessionId) return res.status(401).json({ message: "Not logged in" });

  const { product_id, quantity = 1 } = req.body;
  if (!product_id) return res.status(400).json({ message: "product_id required" });

  try {
    const connection = await getConnection();

    const [sessions] = await connection.execute(
      "SELECT user_id FROM sessions WHERE session_id = ? AND expires_at > NOW()",
      [sessionId]
    );
    if (sessions.length === 0) {
      await connection.end();
      return res.status(401).json({ message: "Invalid session" });
    }
    const userId = sessions[0].user_id;

    // Upsert: if item already in cart, increment quantity; otherwise insert
    await connection.execute(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, product_id, quantity]
    );

    await connection.end();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// In server.js — PATCH quantity
app.patch("/api/cart/:cart_id", async (req, res) => {
  const sessionId = getCookie(req, "session_id");
  if (!sessionId) return res.status(401).json({ message: "Not logged in" });

  const { cart_id } = req.params;
  const { delta } = req.body; // +1 or -1

  try {
    const connection = await getConnection();
    await connection.execute(
      "UPDATE cart SET quantity = quantity + ? WHERE cart_id = ?",
      [delta, cart_id]
    );
    // Remove if quantity drops to 0
    await connection.execute(
      "DELETE FROM cart WHERE cart_id = ? AND quantity <= 0",
      [cart_id]
    );
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In server.js — DELETE item
app.delete("/api/cart/:cart_id", async (req, res) => {
  const sessionId = getCookie(req, "session_id");
  if (!sessionId) return res.status(401).json({ message: "Not logged in" });

  try {
    const connection = await getConnection();
    await connection.execute("DELETE FROM cart WHERE cart_id = ?", [req.params.cart_id]);
    await connection.end();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const connection = await getConnection();

    const [products] = await connection.execute(
      "SELECT product_id, name, description, price, stock_qty, image_url FROM products ORDER BY product_id ASC"
    );

    await connection.end();

    return res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Products error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load products.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});