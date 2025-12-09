import { BlogsService } from "../../services/blogs.service";
import type { Context } from "elysia";
import { HttpStatusEnum } from "elysia-http-status-code/status";

export const getBlogs = async ({ query }: { query: { limit?: number; offset?: number } }) => {
    const data = await BlogsService.getAll(query.limit, query.offset);
    return {
        status: HttpStatusEnum.HTTP_200_OK,
        data
    };
};

export const createBlog = async ({ body, user }: { body: { title: string; description: string }; user?: any }) => {
    const newBlog = await BlogsService.create({
        ...body,
        authorId: user.id
    });
    return {
        status: HttpStatusEnum.HTTP_201_CREATED,
        data: newBlog
    };
};

export const updateBlog = async ({ params: { id }, body, user, set }: { params: { id: string }; body: { title: string; description: string }; user?: any; set: Context['set'] }) => {
    const result = await BlogsService.update(id, body, user.id);
    
    if (!result.success || !result.data) {
        set.status = result.code || 500;
        return {
            success: false,
            message: result.error || "An error occurred"
        };
    }

    return {
        status: HttpStatusEnum.HTTP_200_OK,
        data: result.data
    };
};

export const deleteBlog = async ({ params: { id }, user, set }: { params: { id: string }; user?: any; set: Context['set'] }) => {
    const result = await BlogsService.delete(id, user.id);

    if (!result.success) {
        set.status = result.code || 500;
        return {
            success: false,
            message: result.error || "An error occurred"
        };
    }

    return {
        status: HttpStatusEnum.HTTP_200_OK,
        success: true
    };
};
