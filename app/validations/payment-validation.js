const Payment=require('../models/payment-model')
const paymentSchema = { 
    customerId: {
        notEmpty:{
            errorMessage: 'customerId is required'
        },
        isMongoId: {
            errorMessage: 'invalid customer id'
        }
    },
    eventId:{
        notEmpty:{
            errorMessage:"event id is required"
        },
        isMongoId:{
            errorMessage:"invalid event id"
        }
    },
    amount : {
        notEmpty:{
            errorMessage:"amount cannot be empty"
        },
        isNumeric:{
            options:{
                min:0
            },
            errorMessage:"amount should be more than 0"
        }
    },                            
}

module.exports  = paymentSchema