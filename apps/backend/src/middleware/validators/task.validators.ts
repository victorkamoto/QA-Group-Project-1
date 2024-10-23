import { checkSchema } from "express-validator";

export const createTaskSchema = checkSchema({
    description: {
        isString: {
            errorMessage: 'description must be a string!'
        },
        isLength: {
            options: {min: 8},
            errorMessage: 'description must be atleast 8 characters long!'
        },
        escape: true
    },
    status: {
        isString: {
            errorMessage: 'status must be a string!'
        },
        isLength: {
            options: {min: 9, max: 11},
            errorMessage: 'status must be string of 9-11 character long!'
        },
        escape: true
    },
    dueDate: {
        isDate: {
            errorMessage: 'dueDate must be a date!'
        },
        escape: true
    },
    projectId: {
        isString: {
            errorMessage: 'projectId must be a string!'
        },
        escape: true
    },
    assignedToId: {
        isString: {
            errorMessage: 'assignedToId must be a string!'
        },
        escape: true
    }
})
