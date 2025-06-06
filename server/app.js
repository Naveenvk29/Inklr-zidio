import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/userRoutes.js";
import categoryRoutes from "./Routes/catergoryRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("WelCome to the Inkir api");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/blogs", blogRoutes);

export { app };
