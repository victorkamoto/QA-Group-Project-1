const createUser = {
    name: {
        notEmpty: {
            errorMessage: 'name cannot be empty!'
        },
        isLength: {
            options: { min: 5, max: 12 },
            errorMessage: 'name must be a 5-12 character string'
        },
        isString: {
            errorMessage: 'name must be a string!'
        },
        escape: true
    },
    email: {
        notEmpty: {
            errorMessage: 'email cannot be empty!'
        },
        isEmail: {
            errorMessage: "email must be a valid email address!"
        },
        isLength: {
            options: { min: 10, max: 50 },
            errorMessage: 'email must be 10-50 characters long!'
        },
        escape: true
    },
    password: {
        isEmpty: {
            errorMessage: 'password cannot be empty!'
        },
        isSisString: {
            errorMessage: 'passord must be a string!'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'password must be at least 8 characters long!'
        },
        escape: true
    }
}

export default {
    create: {
        body: createUser
    },
}
