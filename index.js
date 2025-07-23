const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/create", async (req, res) => {
  const product = req.body;
  console.log("Received product:", product);
  res.status(200).json({ success: true, message: "Product received" });
});

app.get("/", (req, res) => {
  res.send("Meesho2Shopify Render backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
