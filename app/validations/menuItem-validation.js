const MenuItem=require('../models/menuItem-model')
const menuItemValidation = {
    catererId: {
        notEmpty: {
            errorMessage: 'catererId is required'
        }
    },
    name: {
        notEmpty: {
            errorMessage: 'name is required'
        }
    },
    itemType: {
        notEmpty: {
            errorMessage: 'itemType is required'
        },
        isIn: {
            options: [['appetizer', 'main', 'dessert']],
            errorMessage: 'Item type must be one of: appetizer, main, dessert'
        }
    },
    itemImage: {
        notEmpty: {
            errorMessage: 'Item image is required'
        }
    }
}
module.exports = menuItemValidation