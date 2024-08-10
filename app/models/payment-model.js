const mongoose=require('mongoose')
const {Schema,model}=mongoose

const paymentSchema=new Schema({
    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    transactionId:String,
    paymentType:String,
    amount:Number,
    paymentStatus:String
},{timestamps:true})

const Payment=model('Payment',paymentSchema)


module.exports=Payment