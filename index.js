const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: '10mb' }));

const SHOPIFY_STORE = "shopaholics-e-commerce-pvt-ltd.myshopify.com";
const SHOPIFY_TOKEN = "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";

app.post("/api/create", async (req, res) => {
  try {
    const { title, description, images } = req.body;
    const uploadedImages = [];

    for (const url of images.slice(0, 5)) {
      try {
        const response = await axios.get(url, { responseType: "arraybuffer" });
        const imgBase64 = Buffer.from(response.data, "binary").toString("base64");
        uploadedImages.push({ attachment: imgBase64 });
      } catch (err) {
        console.error("Image download failed:", url);
      }
    }

    const product = {
      product: {
        title,
        body_html: `<p>${description}</p>`,
        images: uploadedImages
      }
    };

    const shopifyRes = await axios.post(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/products.json`,
      product,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_TOKEN
        }
      }
    );

    res.status(200).json(shopifyRes.data);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Failed to create product");
  }
});

app.get("/", (req, res) => {
  res.send("Meesho2Shopify Backend is running.");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});