require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const sql = require("mssql");

const app = express();
const clientBuildPath = path.join(__dirname, "client", "dist");
const clientEntryPath = path.join(clientBuildPath, "index.html");

const pool = new sql.ConnectionPool({
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
});

app.use(cors());
app.use(express.json());

app.get("/api/products", async (req, res) => {
  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .query(
        "SELECT Id AS id, Name AS name, Price AS price, ImageUrl AS image FROM dbo.Products",
      );

    res.json(result.recordset);
  } catch (error) {
    console.error("Failed to load products:", error);
    res.status(500).json({ message: "Failed to load products." });
  }
});

app.post("/api/order", async (req, res) => {
  const { productId } = req.body;

  if (!Number.isInteger(productId) || productId <= 0) {
    return res.status(400).json({ message: "A valid productId is required." });
  }

  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input("productId", sql.Int, productId)
      .query(`
        INSERT INTO dbo.Orders (ProductId, Status)
        OUTPUT INSERTED.Id AS id
        VALUES (@productId, 'Pending')
      `);

    res.status(201).json({
      message: "Order submitted successfully.",
      status: "Pending",
      orderId: result.recordset[0].id,
    });
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ message: "Failed to submit order." });
  }
});

app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

app.use(express.static(clientBuildPath));
app.get("/{*path}", (req, res, next) => {
  res.sendFile(clientEntryPath, (error) => {
    if (error) {
      next(error);
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`QuitSmoke Store running on port ${PORT}`),
);
