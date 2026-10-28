import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import reportRoutes from "./routes/report.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import orderRoutes from "./routes/order.routes.js";
import trackRoutes from "./routes/track.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/auth", authRoutes);
app.use("/reports", reportRoutes);
app.use("/services", serviceRoutes);
app.use("/orders", orderRoutes);
app.use("/track", trackRoutes);

app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
