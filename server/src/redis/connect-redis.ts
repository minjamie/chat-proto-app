import RedisStore from "connect-redis";
import session from "express-session";
import { redisClient } from "./redis-client";

interface sessionConfig {}
export const sessionConfig = {
  store: new RedisStore({
    client: redisClient,
    // ttl: REDIS_TIME_TO_LIVE,
    prefix: "session:",
  }),
  cookie: {
    httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 함 localhost, ip일때는 쓰면 안된다. 저장안됨
    sameSite: "none",
    secure: true,
    // domain: ".acoha.store",
  },
  credentials: true,
  secret: "SESSION_SECRET",
  resave: false,
  saveUninitialized: false, // 세션에 저장할 내역 없으면 저장안함
} as any;

export const useSession = () => session(sessionConfig);
