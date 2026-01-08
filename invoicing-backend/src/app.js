import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import itemRoutes from "./routes/item.routes.js";
dotenv.config();

const app = express();

app.use(cors({
     origin: "http://localhost:5173",
     credentials: true,
}))

app.use (express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// ROUTES
app.use("/Auth", authRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/Item", itemRoutes);

// Example route
app.get("/", (req, res) => {
  res.send("Invoicing Backend is running");
});

export default app;