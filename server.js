const express = require("express");
const path = require("path");
require("dotenv").config({ path: "api.env" });

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.use(express.static(path.join(__dirname)));

app.get("/api-key", (req, res) => {
  res.json({ apiKey: API_KEY });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
