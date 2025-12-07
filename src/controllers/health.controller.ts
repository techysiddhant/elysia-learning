import { Context } from 'elysia';

export const healthController = {
  check: () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  },
};
