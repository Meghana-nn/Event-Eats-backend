const Caterer = require('../models/caterer-model')
const catererValidationSchema = {
    name: {
        notEmpty: {
            errorMessage: 'name is required'
        }
    },
    mobile: {
        notEmpty: {
            errorMessage: 'mobile is required'
        },
        isNumeric: {
            errorMessage: 'mobile must be a number'
        }
    },
    location: {
        notEmpty: {
            errorMessage: 'location is required'
        }
    },
    categories: {
        notEmpty: {
            errorMessage: 'categories is required'
        },
        isArray: {
            errorMessage: 'categories must be an array'
        }
    },
    cuisines: {
        notEmpty: {
            errorMessage: 'cuisines is required'
        },
        isArray: {
            errorMessage: 'cuisines must be an array'
        }
    },
    isVeg: {
        notEmpty: {
            errorMessage: 'isVeg is required'
        },
        isBoolean: {
            errorMessage: 'isVeg must be either true or false'
        }
    }

}
module.exports = catererValidationSchema