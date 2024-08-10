const mongoose = require('mongoose')
const{Schema, model} = mongoose
const catererSchema = new Schema({
    name: String,
    mobile: Number,
    location: String,
    categories: [{ type: String }],
    cuisines: [{ type: String }],
    isVeg: Boolean,
    isVerified: {type: Boolean, default:false},
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })
const Caterer = model('Caterer', catererSchema)
module.exports = Caterer