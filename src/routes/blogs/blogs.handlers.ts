import { db } from "../../db";
import { blogs } from "../../db/schema/blogs";
import { eq } from "drizzle-orm";
import type { Context } from "elysia";
import { HttpStatusEnum } from "elysia-http-status-code/status";

export const getBlogs = async () => {
    return await db.select().from(blogs);
};

export const createBlog = async ({ body, user }: { body: { title: string; description: string }; user?: any }) => {
    const { title, description } = body;
    const newBlog = await db.insert(blogs).values({
        title,
        description,
        authorId: user.id,
    }).returning();
    return {
        status: HttpStatusEnum.HTTP_201_CREATED,
        data: newBlog[0]
    };
};

export const updateBlog = async ({ params: { id }, body, user, set }: { params: { id: string }; body: { title: string; description: string }; user?: any; set: Context['set'] }) => {
    const { title, description } = body;
    // Verify ownership
    const existing = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!existing.length) {
        set.status = HttpStatusEnum.HTTP_404_NOT_FOUND;
        return {
            status: HttpStatusEnum.HTTP_404_NOT_FOUND,
            message: "Blog not found"
        };
    }
    if (existing[0].authorId !== user.id) {
        set.status = HttpStatusEnum.HTTP_403_FORBIDDEN;
        return {
            status: HttpStatusEnum.HTTP_403_FORBIDDEN,
            message: "Unauthorized"
        };
    }

    const updated = await db.update(blogs)
      .set({ title, description, updatedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();
    return {
        status: HttpStatusEnum.HTTP_200_OK,
        data: updated[0]
    };
};

export const deleteBlog = async ({ params: { id }, user, set }: { params: { id: string }; user?: any; set: Context['set'] }) => {
    const existing = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!existing.length) {
        set.status = HttpStatusEnum.HTTP_404_NOT_FOUND;
        return {
            status: HttpStatusEnum.HTTP_404_NOT_FOUND,
            message: "Blog not found"
        };
    }
    if (existing[0].authorId !== user.id) {
        set.status = HttpStatusEnum.HTTP_403_FORBIDDEN;
        return {
            status: HttpStatusEnum.HTTP_403_FORBIDDEN,
            message: "Unauthorized"
        };
    }

    await db.delete(blogs).where(eq(blogs.id, id));
    return {
        status: HttpStatusEnum.HTTP_200_OK,
        success: true
    };
};
