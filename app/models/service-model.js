const mongoose=require('mongoose')
const {Schema,model}=mongoose

const serviceSchem=new Schema({
  catererId:{
   type:Schema.Types.ObjectId,
   ref:'Caterer'
  },
  serviceName:String,
  description:String,
  price:Number,
  duration:Number,
  category:String,
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true})

const Service=model('Service',serviceSchem)

module.exports=Service