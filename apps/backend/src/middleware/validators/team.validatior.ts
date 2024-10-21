import { checkSchema } from "express-validator";

export const createTeamSchema = checkSchema({
    name: {
        isString: {
            errorMessage: 'name must be a string'
        },
        isLength: {
            options: { min: 5, max: 20 },
            errorMessage: 'name must be a string of 5-20 characters'
        },
        escape: true
    },
    description: {
        isString: {
            errorMessage: 'description must be a string'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'description must be atleast 8 characters long'
        },
        escape: true
    }
})
