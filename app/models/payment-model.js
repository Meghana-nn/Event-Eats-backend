const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  menuCartId: { 
    type: Schema.Types.ObjectId,
    ref: 'MenuCart'
  },
  transactionId: String,
  paymentType: String,
  amount: Number,
  paymentStatus: String
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

module.exports = Payment;
