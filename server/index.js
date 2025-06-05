import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import { app } from "./app.js";

dotenv.config();

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
