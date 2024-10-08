const mongoose = require('mongoose')
const {Schema, model} = mongoose
const menuItemSchema = new Schema ({
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'Caterer'
    },
    name: String,
    amount:Number,
    itemType: [{ type : String }],
    menuImages: [String]
})
const MenuItem = model('MenuItem', menuItemSchema)
module.exports = MenuItem