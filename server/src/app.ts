import connectDB from "@configs/db";
import { errorHandler, notFound } from "@middlewares/errorMiddleware";
import routes from "@routes/index";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

const app = express();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use('/api', routes);

app.use(notFound)
app.use(errorHandler)

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on("setup", (userData) => {
    socket.join(userData?._id)
    console.log(userData?._id)
    socket.emit("connected")
  })

  socket.on("join chat", (room) => {
    socket.join(room)
    console.log("user joined room " + room)
  })
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(colors.yellow(`server listening on port ${PORT}`));
});