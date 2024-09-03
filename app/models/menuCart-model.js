const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const menuCartSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    services: [
        {
            serviceId: {
                type: Schema.Types.ObjectId,
                ref: 'Service'
            },
            name: String,
            description: String,
            price: Number,
            totalEventCost: Number, 
        }
    ],
    menuItems: [
        {
            menuItemId: {
                type: Schema.Types.ObjectId,
                ref: 'MenuItem'
            },
            name: String,
            quantity: Number,
            amount: Number,
            menuImage: String,
           
        }
    ],
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'Caterer',
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    totalAmount:Number,
    totalEventCost: Number,
    eventName:String,
    noOfPeople:Number
}, { timestamps: true });

const MenuCart = model('MenuCart', menuCartSchema);

module.exports = MenuCart;
