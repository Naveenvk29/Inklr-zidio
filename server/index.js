import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import { app } from "./app.js";
import http from "http";
import { initSocket } from "./utils/socket.js";
dotenv.config();
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Error connecting to MongoDB", err);
  });
