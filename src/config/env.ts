import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url(),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(3000),
});

export const env = envSchema.parse(process.env);
