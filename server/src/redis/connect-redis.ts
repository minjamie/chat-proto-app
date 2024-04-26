import RedisStore from "connect-redis";
import session from "express-session";
import { IncomingMessage } from "http";
import redisClient from "./redis-client";

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
