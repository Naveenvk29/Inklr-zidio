import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./Routes/userRoutes.js";
import categoryRoutes from "./Routes/catergoryRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import commentRoutes from "./Routes/commentRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("WelCome to the Inkir api");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/comments", adminRoutes);

export { app };
