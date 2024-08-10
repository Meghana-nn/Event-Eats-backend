const mongoose=require('mongoose')
const {Schema,model}=mongoose
const eventSchema=new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catererId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: String, 
    startDate: Date,
    endDate: Date,
    noOfPeople: Number,
    address: {
        building: String,
        locality: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    geoLocation: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    amount: Number
}, { timestamps: true });
       
const Event=model('Event',eventSchema)
module.exports=Event