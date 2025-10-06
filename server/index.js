import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRouter from "./routes/auth.route.js";
import adminRouter from "./routes/admin.route.js";
import CarRouter from "./routes/car.route.js";
import categoryRouter from "./routes/category.route.js";
import locationRouter from "./routes/location.route.js";
import userRouter from "./routes/user.route.js";
import staffRouter from "./routes/staff.route.js";
import paymentRouter from "./routes/payment.route.js";
import analysticRoute from "./routes/analytics.route.js";
import webhook from "./webhook/stripeWebhook.js";
import "./services/redis/redis.js";
import "./DB/prisma/connectionTest.js";
import "./jobs/jobRunner.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:3000"];
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("new client connected", socket.id);
});
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

app.use("/webhook", webhook);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/car", CarRouter);
app.use("/api/location", locationRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/staff", staffRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/analytics", analysticRoute);

server.listen(process.env.PORT, () => {
  console.log("server running");
});

export { io };
