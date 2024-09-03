const Event = require('../models/event-model');
const _ = require('lodash');
const moment = require('moment');

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
        const startDateTime = moment(`${body.startDate} ${body.startTime}`, 'YYYY-MM-DD h:mm A').toDate();
        const endDateTime = moment(`${body.endDate} ${body.endTime}`, 'YYYY-MM-DD h:mm A').toDate();

        const event = new Event({
            customerId: customerId,
            catererId: catererId,
            name: body.name,
            startDate: startDateTime,
            endDate: endDateTime,
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
            }
            
        });

        await event.save();

        const formattedEvent = {
            ...event.toObject(),
            startDate: moment(event.startDate).format('DD MMMM YYYY, h:mm:ss a'),
            endDate: moment(event.endDate).format('DD MMMM YYYY, h:mm:ss a')
        };

        res.status(200).json(formattedEvent);
        
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
        const customerId = req.params.id;
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



eventsCtrl.update = async (req, res) => {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    try {
        const eventId = req.params.id;
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

        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const startDateTime = moment(`${body.startDate} ${body.startTime}`, 'YYYY-MM-DD h:mm A').toDate();
        const endDateTime = moment(`${body.endDate} ${body.endTime}`, 'YYYY-MM-DD h:mm A').toDate();

        // Update the event with new details
        event.name = body.name || event.name;
        event.startDate = startDateTime || event.startDate;
        event.endDate = endDateTime || event.endDate;
        event.noOfPeople = body.noOfPeople || event.noOfPeople;
        event.address = {
            building: address.building || event.address.building,
            locality: address.locality || event.address.locality,
            city: address.city || event.address.city,
            state: address.state || event.address.state,
            pincode: address.pincode || event.address.pincode,
            country: address.country || event.address.country
        };
        event.geoLocation = {
            type: 'Point',
            coordinates: [lon, lat]
        };

        // Save the updated event
        await event.save();

        const formattedEvent = {
            ...event.toObject(),
            startDate: moment(event.startDate).format('DD MMMM YYYY, h:mm:ss a'),
            endDate: moment(event.endDate).format('DD MMMM YYYY, h:mm:ss a')
        };

        res.status(200).json(formattedEvent);
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

eventsCtrl.delete = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({message:'event  deleted successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};




module.exports = eventsCtrl;
