const mongoose=require('mongoose')
const {Schema,model}=mongoose

const menuCartSchema=new Schema({
    eventId:{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    itemId:{
        type: Schema.Types.ObjectId,
        ref: 'MenuItem'
    },
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'Caterer'
      },
      services: [
        {
          name: String,
          description: String,
          price: Number
        }
      ],
      menuItems: [
        {
          name: String,
          quantity: Number,
          price: Number
        }
      ],
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},{timestamps:true})

const MenuCart=model('MenuCart',menuCartSchema)

module.exports=MenuCart