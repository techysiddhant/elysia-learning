import { t } from "elysia";

export const getBlogsSchema = {
  detail: { tags: ["Blogs"] },
};

export const createBlogSchema = {
  body: t.Object({
    title: t.String(),
    description: t.String(),
  }),
  detail: { tags: ["Blogs"] },
};

export const updateBlogSchema = {
  params: t.Object({ id: t.String() }),
  body: t.Object({
    title: t.String(),
    description: t.String(),
  }),
  detail: { tags: ["Blogs"] },
};

export const deleteBlogSchema = {
  params: t.Object({ id: t.String() }),
  detail: { tags: ["Blogs"] },
};
