import { checkSchema } from 'express-validator';

export const createUserSchema = checkSchema({
    name: {
        isString: {
            errorMessage: 'name cannot be empty'
        },
        isLength: {
            options: { min: 5, max: 20 },
            errorMessage: 'name must be a string of 5-20 characters'
        },
        escape: true
    },
    email: {
        isEmail: {
            errorMessage: 'email cannot be empty'
        },
        isLength: {
            options: { min: 6, max: 20 },
            errorMessage: 'email must be a string of 6-20 characters'
        },
        escape: true
    },
    password: {
        isString: {
            errorMessage: 'password must be a string'
        },
        isLength: {
            options: { min: 8, max: 72 },
            errorMessage: 'password must be a string of 8-72 characters'
        },
        escape: true
    }
})
