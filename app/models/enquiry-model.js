const mongoose =require('mongoose')
const {Schema,model}=mongoose
const enquirySchema=new Schema({
    customerId :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    catererId:{
        type: Schema.Types.ObjectId,
        ref: 'Caterer'
    },
    message :String,
   responses:String,

    
},{timestamps:true})

const Enquiry=model('Enquiry',enquirySchema)
module.exports=Enquiry