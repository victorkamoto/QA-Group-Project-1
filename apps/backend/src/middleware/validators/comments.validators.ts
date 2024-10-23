import { checkSchema } from "express-validator";

export const createCommentSchema = checkSchema({
    content: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Content is required!',
        escape: true
    },
    taskId: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'Task ID is required!',
        escape: true
    },
    userId: {
        in: ['body'],
        isString: true,
        notEmpty: true,
        errorMessage: 'User ID is required!',
        escape: true
    }
});
