import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';
import { rateLimit } from 'elysia-rate-limit';
import { cors } from '@elysiajs/cors';
import { logger } from 'elysia-logger';
import { routes } from './routes';
import { env } from './config/env';

import { authMiddleware } from './middleware/auth';

export const app = new Elysia()
  .onRequest(({ request }) => {
    console.log('!!! INCOMING REQUEST:', request.method, request.url);
  })
  .get("/", () => {
    return {
      status: "ok",
      message: "Elysia 10x API is running"
    };
  })
  .use(logger({
    level: env.LOG_LEVEL,
  }))
  .use(rateLimit({
    max: 60,
    duration: 60000,
    generator: (req, server) => req.headers.get('x-api-key') || server?.requestIP(req)?.address || "",
    errorResponse: new Response(JSON.stringify({
        status: 429,
        message: 'Too many requests - try again later',
    }), { status: 429, headers: { 'Content-Type': 'application/json' } })
  }))
  .use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(openapi({
    path: '/docs',
    documentation: {
      info: {
        title: 'Elysia 10x API',
        version: '1.0.0',
      },
    },
  }))
  .use(authMiddleware)
  .use(routes)
  .onError(({ code, error }) => {
    if (error instanceof Response) {
      return error;
    }
    return {
      status: 'error',
      code,
      message: error.toString(),
    };
  });

export type App = typeof app;
