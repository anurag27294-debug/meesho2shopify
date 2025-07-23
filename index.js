const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

// ✅ Place this BEFORE your routes!
app.use(cors({ origin: "*" }));
app.use(express.json());

const SHOPIFY_STORE = "shopaholics-e-commerce-pvt-ltd.myshopify.com";
const SHOPIFY_TOKEN = "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"; // (✅ Remove later from public!)

app.post("/api/create", async (req, res) => {
  try {
    const { title, description, images } = req.body;

    const uploadedImages = [];
    for (const url of images.slice(0, 5)) {
      const imageResp = await axios.get(url, { responseType: "arraybuffer" });
      uploadedImages.push({
        attachment: Buffer.from(imageResp.data).toString("base64"),
      });
    }

    const product = {
      title,
      body_html: `<p>${description}</p>`,
      images: uploadedImages,
    };

    const shopifyRes = await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`,
      { product },
      {
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, product: shopifyRes.data });
  } catch (error) {
    console.error("❌ Shopify error:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Meesho2Shopify Render backend is running.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
