import { Elysia } from 'elysia';
import { auth } from '@/lib/auth';
import { HttpStatusEnum } from 'elysia-http-status-code/status';

export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .macro({
    auth: {
      async resolve({ request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) {
          throw Response.json(
            {
              status: HttpStatusEnum.HTTP_401_UNAUTHORIZED,
              message: 'Unauthorized',
            },
            { status: HttpStatusEnum.HTTP_401_UNAUTHORIZED },
          );
        }

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  })
  .as('global');
