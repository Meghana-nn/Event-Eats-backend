const MenuCart=require('../models/menuCart-model')
const menuCartValidation = {
    eventId : {
        notEmpty : {
            errorMessage : 'event ID is required'
        },
        isMongoId : {
            errorMessage : 'event ID must be a valid MongoDB ID'
        },
        trim : true
    },
    itemId : {
        notEmpty : {
            errorMessage : 'item ID is required'
        },
        isMongoId : {
            errorMessage : 'item ID must be a valid MongoDB ID'
        },
        trim : true
    },
    userId : {
        notEmpty : {
            errorMessage : 'user ID is required'
        },
        isMongoId : {
            errorMessage : 'user ID must be a valid MongoDB ID'
        },
        trim : true
    },
}
module.exports = menuCartValidation