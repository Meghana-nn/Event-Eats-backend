const mongoose =require('mongoose')
const {Schema,model}=mongoose
const enquirySchema=new Schema({
    customerId :{
        type: Schema.Types.ObjectId,
        ref: 'customer'
    },
    catererid:{
        type: Schema.Types.ObjectId,
        ref: 'Caterer'
    },
    message :String,
    response :String
},{timestamps:true})

const Enquiry=model('Enquiry',enquirySchema)
module.exports=Enquiry