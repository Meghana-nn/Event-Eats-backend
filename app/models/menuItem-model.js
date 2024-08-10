const mongoose = require('mongoose')
const {Schema, model} = mongoose
const menuItemSchema = new Schema ({
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'Caterer'
    },
    name: String,
    itemType: [{ type : String }],
    itemImage: String
})
const MenuItem = model('MenuItem', menuItemSchema)
module.exports = MenuItem