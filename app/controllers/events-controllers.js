const Event = require('../models/event-model')
// const{validationResult} = require('express-validator')
const axios = require('axios')
const _ = require('lodash')
const eventsCtrl = {}

eventsCtrl.create = async(req, res) => {
    // const errors = validationResult(req)
    // if(!errors.isEmpty()) {
    //     return res.status(400).json({errors: errors.array()})
    // }
    try{
        const body = req.body
        const address = _.pick(body.address, ['building', 'locality', 'city', 'state', 'pincode', 'country'])
        const searchString = `${address.building}%2C%20${address.locality}%2C%20${address.city}%2C%20${address.state}%2C%20${address.pincode}%2C%20${address.country}`
        const mapResponse = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${searchString}&apiKey=${process.env.GEOAPIFYKEY}`)
        if(mapResponse.data.features.length == 0){
            return res.status(400).json({errors: [{ msg: "Invalid address", path: "Invalid address" }]})
        }
        const {features}= mapResponse.data
        console.log('features', features[0])
        const {lon, lat} = features[0].properties
        const catererId = req.user.id
        const customerId = req.params.catererId
        const event = new Event({
                        customerId: customerId,
                        catererId: catererId,
                        name: body.name,
                        startDate: body.startDate,
                        endDate: body.endDate,
                        noOfPeople: body.noOfPeople,
                        address: {
                            building: address.building,
                            locality: address.locality,
                            city: address.city,
                            state: address.state,
                            pincode: address.pincode,
                            country: address.country
                        },
                        geoLocation: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        },
                        amount: body.amount
                    });
        await event.save()
        res.status(200).json(event)
    }
    catch(err){
        console.log(err)
        res.status(400).json(err.message)
    }
}
eventsCtrl.list=async(req,res)=>{
    try{
        const listUsers=await Event.find()
        res.json(listUsers)
     }catch(err){
         res.status(500).json({error:'something went wrong'})
     }
 }
 

module.exports = eventsCtrl