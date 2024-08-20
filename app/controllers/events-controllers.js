const Event = require('../models/event-model');
const _ = require('lodash');

const eventsCtrl = {};

eventsCtrl.create = async (req, res) => {
    
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    
    try {
        const body = req.body;
        const address = _.pick(body.address, ['building', 'locality', 'city', 'state', 'pincode', 'country']);
        const searchString = `${address.building}, ${address.locality}, ${address.city}, ${address.state}, ${address.pincode}, ${address.country}`;
        const requestOptions = {
            method: 'GET',
        };

        const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchString)}&apiKey=${process.env.GEOAPIFY_KEY}`, requestOptions);
        const mapResponse = await response.json();

        if (!mapResponse.features || mapResponse.features.length === 0) {
            return res.status(400).json({ errors: [{ msg: "Invalid address", path: "address" }] });
        }

        const { lon, lat } = mapResponse.features[0].properties;
        const customerId = req.user.id;
        const catererId = req.params.catererId;

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

        await event.save();
        res.status(200).json(event);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

eventsCtrl.list = async (req, res) => {
    try {
        const listUsers = await Event.find();
        res.json(listUsers);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

eventsCtrl.getByCustomerId = async (req, res) => {
    try {
        const customerId = req.user.id;
        const events = await Event.find({ customerId: customerId });
        if (!events || events.length === 0) {
            return res.status(404).json({ error: 'No events found for this customer' });
        }
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

eventsCtrl.getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = eventsCtrl;
