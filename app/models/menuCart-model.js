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
    userId :{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
},{timestamps:true})

const MenuCart=model('MenuCart',menuCartSchema)

module.exports=MenuCart