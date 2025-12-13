import { Elysia } from 'elysia';

export const welcomeController = new Elysia().get(
  '/',
  () => {
    return {
      message: 'Welcome to Elysia 10x API',
      status: 'ok',
    };
  },
  {
    detail: { hide: true },
  },
);
