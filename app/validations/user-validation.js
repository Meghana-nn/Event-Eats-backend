const User = require('../models/user-model')
const userRegisterSchema = {
    username: {
        notEmpty: {
            errorMessage: 'username is required'
        },
        trim: true
    },
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail:{
            errorMessage: 'email should be in a valid format'
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email : value})
                if(!user){
                    return true
                }else{
                    throw new Error('email is already exists')
                }
            }
        },
        trim: true

    },
    password: {
        notEmpty: {
            errorMessage: 'password id required'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password must be in 8-128 characters long'
        },
        trim: true
    },
    role: {
        notEmpty: {
            errorMessage: 'role is required'
        },
        isIn:{
            options:[['admin','caterer', 'customer', 'invitee']],
            errorMessage:'role should be one of: admin, caterer, customer, invitee' 
        },
        trim:true
    }
}
const userLoginSchema = {
    email: {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail:{
            errorMessage: 'email should be in a valid format'
        },
        trim: true
    },
    password: {
        notEmpty: {
            errorMessage: 'password id required'
        },
        isLength: {
            options: {min: 8, max: 128},
            errorMessage: 'password must be in 8-128 characters long'
        },
        trim: true
    }
}
module.exports = {
    userRegisterSchema,
    userLoginSchema
}
