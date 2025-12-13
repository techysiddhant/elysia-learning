import { t } from 'elysia';

// General purpose error structure
export const ErrorResponseSchema = t.Object({
  success: t.Boolean({ default: false }),
  message: t.String({ default: 'An error occurred' }),
});
