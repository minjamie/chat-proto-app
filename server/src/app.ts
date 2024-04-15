import express, { Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import { chats } from "@data/data";
import dotenv from "dotenv";
const app = express();
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
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
app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/:id", (req, res) => {
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});

io.on("connect", (socket) => {});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
