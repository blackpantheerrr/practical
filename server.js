const express = require("express");
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;
const urls = [];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("URL Shortener API is running");
});

app.post("/shorten", (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ message: "longUrl is required" });
    }

    const shortCode = nanoid(6);

    const newUrl = {
      longUrl,
      shortCode,
      createdAt: new Date()
    };
    urls.push(newUrl);

    res.status(201).json({
      shortUrl: `${BASE_URL}/${shortCode}`,
      shortCode,
      longUrl
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/:shortCode", (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = urls.find((entry) => entry.shortCode === shortCode);

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
