import { t } from "elysia";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { blogs } from "../../db/schema/blogs";
import { ErrorResponseSchema } from "../../utils/models";

// Blog entity schema generated from Drizzle
export const BlogSchema = createSelectSchema(blogs, {
  createdAt: t.Date(),
  updatedAt: t.Nullable(t.Date()),
});

export const BlogListSchema = t.Array(BlogSchema);

// Generate base insert schema
const _insertBlogSchema = createInsertSchema(blogs, {
    title: t.String({ minLength: 1 }),
    description: t.String({ minLength: 1 }),
});

// Define input types using TypeBox
export const createBlogSchema = {
  body: t.Pick(_insertBlogSchema, ['title', 'description']),
  detail: { 
    tags: ["Blogs"],
  },
  response: {
    201: t.Object({
      status: t.Number({ example: 201 }),
      data: BlogSchema
    }),
    400: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const updateBlogSchema = {
  params: t.Object({ id: t.String({ format: 'uuid' }) }),
  body: t.Pick(_insertBlogSchema, ['title', 'description']),
  detail: { 
    tags: ["Blogs"],
  },
  response: {
    200: t.Object({
      status: t.Number({ example: 200 }),
      data: BlogSchema
    }),
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const deleteBlogSchema = {
  params: t.Object({ id: t.String({ format: 'uuid' }) }),
  detail: { 
    tags: ["Blogs"],
  },
  response: {
    200: t.Object({
      status: t.Number({ example: 200 }),
      success: t.Boolean({ example: true })
    }),
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
    403: ErrorResponseSchema,
    404: ErrorResponseSchema,
    500: ErrorResponseSchema
  }
};

export const getBlogsSchema = {
  query: t.Object({
      limit: t.Optional(t.Numeric({ default: 10 })),
      offset: t.Optional(t.Numeric({ default: 0 }))
  }),
  detail: { 
    tags: ["Blogs"],
  },
  response: {
    200: t.Object({
      status: t.Number({ example: 200 }),
      data: BlogListSchema
    }),
    500: ErrorResponseSchema
  }
};
