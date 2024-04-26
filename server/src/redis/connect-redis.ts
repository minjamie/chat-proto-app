import RedisStore from "connect-redis";
var session = require("express-session");
import redisClient from "./redis-client";
import { IncomingMessage } from "http";

interface sessionConfig {}
export const sessionConfig = {
  store: new RedisStore({
    client: redisClient,
    prefix: "session:",
  }),
  cookie: {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },
  credentials: true,
  secret: "SESSION_SECRET",
  resave: false,
  saveUninitialized: false,
} as any;

export const useSession = (req: IncomingMessage, {}, next: unknown) =>
  session(sessionConfig);
