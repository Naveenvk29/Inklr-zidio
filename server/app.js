import express from "express";
import cookieParser from "cookie-parser";

import userRoutes from "./Routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("WelCome to the Inkir api");
});

app.use("/api/v1/users", userRoutes);

export { app };
