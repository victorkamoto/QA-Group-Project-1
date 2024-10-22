import { checkSchema } from "express-validator";

export const createProjectSchema = checkSchema({
    name: {
        isString: {
            errorMessage: 'name must be a string!'
        },
        isLength: {
            options: { min: 6, max: 20 },
            errorMessage: 'name must be a sting of 6-20 characters long!'
        },
        escape: true
    },
    teamId: {
        isString: {
            errorMessage: 'teamId must be a string!'
        },
        escape: true
    }
})
