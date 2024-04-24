import { createClient, RedisClientOptions } from "@redis/client";
const redisOptions: RedisClientOptions = {
  socket: {
    // host: process.env.REDIS_HOST,
    // port: Number(process.env.REDIS_PORT),
  },
  // password: process.env.REDIS_PASSWORD,
};

export const redisClient = createClient(redisOptions);
