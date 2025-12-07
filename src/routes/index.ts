import { Elysia } from 'elysia';
import { healthController } from '../controllers/health.controller';
import { welcomeController } from '../controllers/welcome.controller';
import { blogRoutes } from './blogs';

export const routes = new Elysia({ prefix: '/api' })
  .use(welcomeController)
  .use(blogRoutes)
  .get('/health', healthController.check);
