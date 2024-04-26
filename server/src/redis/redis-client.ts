import { createClient, RedisClientOptions } from "@redis/client";
const redisOptions: RedisClientOptions = {
  socket: {
    // host: process.env.REDIS_HOST,
    // port: Number(process.env.REDIS_PORT),
  },
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
};
const redisClient = createClient(redisOptions);
redisClient.connect();

redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
