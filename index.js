const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let currentPrice = 0;

// Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("subscribe", (token) => {
  socket.join(token);
  console.log("Subscribed to:", token);
});
});

// Price fetch loop
setInterval(async () => {
  try {
    const res = await axios.get(
      "https://api.dexscreener.com/latest/dex/search/?q=bitcoin"
    );

    const pair = res.data.pairs.sort(
      (a, b) => b.liquidity.usd - a.liquidity.usd
    )[0];

    const price = parseFloat(pair.priceUsd);

    if (price !== currentPrice) {
      currentPrice = price;
      io.emit("priceUpdate", price);
    }
  } catch (e) {
    console.log("Error fetching price");
  }
}, 2000);

server.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);{
  "name": "crypto-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.7.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5"
  }
}server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});