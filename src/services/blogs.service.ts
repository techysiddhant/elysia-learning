import { eq } from "drizzle-orm";
import { db } from "../db";
import { blogs } from "../db/schema/blogs";

export const BlogsService = {
  getAll: async (limit: number = 10, offset: number = 0) => {
    return await db.select().from(blogs).limit(limit).offset(offset);
  },

  getById: async (id: string) => {
    const result = await db.select().from(blogs).where(eq(blogs.id, id));
    return result[0];
  },

  create: async (data: { title: string; description: string; authorId: string }) => {
    const newBlog = await db.insert(blogs).values({
        title: data.title,
        description: data.description,
        authorId: data.authorId,
    }).returning();
    return newBlog[0];
  },

  update: async (id: string, data: { title: string; description: string }, userId: string) => {
    const existing = await db.select().from(blogs).where(eq(blogs.id, id));
    
    if (!existing.length) {
      return { success: false, error: "Blog not found", code: 404 };
    }
    
    if (existing[0].authorId !== userId) {
        return { success: false, error: "Unauthorized", code: 403 };
    }

    const updated = await db.update(blogs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();

    return { success: true, data: updated[0] };
  },

  delete: async (id: string, userId: string) => {
    const existing = await db.select().from(blogs).where(eq(blogs.id, id));
    
    if (!existing.length) {
        return { success: false, error: "Blog not found", code: 404 };
    }
    
    if (existing[0].authorId !== userId) {
        return { success: false, error: "Unauthorized", code: 403 };
    }

    await db.delete(blogs).where(eq(blogs.id, id));
    return { success: true };
  }
};
