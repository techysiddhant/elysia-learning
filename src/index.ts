import { app } from './app';
import { env } from './config/env';
import { auth } from './lib/auth';
app.mount(auth.handler).listen(env.PORT, () => {
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
  console.log(
    `📚 OpenAPI documentation at http://${app.server?.hostname}:${app.server?.port}/docs`,
  );
  console.log(
    `Better Auth API Docs URL: http://${app.server?.hostname}:${app.server?.port}/api/auth/reference`,
  );
});
