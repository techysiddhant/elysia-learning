import { Elysia } from 'elysia';
import { authMiddleware } from '@/middleware/auth';
import * as handlers from './blogs.controller';
import * as schemas from './blogs.schema';

export const blogRoutes = new Elysia({ prefix: '/blogs' })
  .model({
    blog: schemas.BlogModel,
  })
  .use(authMiddleware)
  .get('/', handlers.getBlogs, schemas.getBlogsSchema)
  .post('/', handlers.createBlog, {
    ...schemas.createBlogSchema,
    auth: true,
  })
  .put('/:id', handlers.updateBlog, {
    ...schemas.updateBlogSchema,
    auth: true,
  })
  .delete('/:id', handlers.deleteBlog, {
    ...schemas.deleteBlogSchema,
    auth: true,
  });
