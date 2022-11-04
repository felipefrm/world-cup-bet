import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { authRoutes } from "./routes/auth";
import { betRoutes } from "./routes/bet";
import { matchRoutes } from "./routes/match";
import { pollRoutes } from "./routes/poll";
import { userRoutes } from "./routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: 'nlwcopa',
  })

  await fastify.register(authRoutes)
  await fastify.register(betRoutes)
  await fastify.register(matchRoutes)
  await fastify.register(pollRoutes)
  await fastify.register(userRoutes)

  await fastify.listen({ port: 3333 })
}

bootstrap();