const mongoose = require('mongoose')
const{Schema, model} = mongoose
const reviewSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: String,
    review: String

},{timestamps: true})
const Review = model('Review', reviewSchema)
module.exports = Review