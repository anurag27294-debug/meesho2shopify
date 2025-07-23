const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
const { createShopifyProduct } = require("./utils/shopify");

// ✅ FIXED: Allow CORS from all origins
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Meesho2Shopify Backend is running.");
});

app.post("/api/create", async (req, res) => {
  try {
    const { title, description, images } = req.body;
    const response = await createShopifyProduct(title, description, images);
    res.status(200).json({ message: "Product created", response });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create product" });
  }
});

exports.api = functions.https.onRequest(app);
