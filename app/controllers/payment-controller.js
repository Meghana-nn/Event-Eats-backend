const Payment = require('../models/payment-model');
const Event =require('../models/event-model')
const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pick } = require('lodash');

const paymentsCtrl = {};

paymentsCtrl.pay = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const body = pick(req.body, ['eventId', 'amount','customerId']);

    try {
        const event = await Event.findById(body.eventId)
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        // Create a customer with Stripe
        const customer = await stripe.customers.create({
            email: req.user.email,
            name: req.user.username,
            address: {
                line1: '123 Example st',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        });

        // Create a session object with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: 'inr', 
                    product_data: {
                        name:event.name, 
                    },
                    unit_amount: body.amount * 100 
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer: customer.id 
        });

        // Create a payment record
        const payment = new Payment({
            eventId:body.eventId,
            transactionId: session.id,
            paymentType: "card", 
            amount: body.amount,
            paymentStatus: "pending" 
        });
        await payment.save();

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentsCtrl.successUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        const body = pick(req.body, ['paymentStatus']);

        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: id }, body, { new: true });

        res.json(updatedPayment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

paymentsCtrl.failedUpdate = async (req, res) => {
    try {
        const id = req.params.id;
        const body = pick(req.body, ['paymentStatus']);

        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: id }, body, { new: true });

        res.json(updatedPayment);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = paymentsCtrl;
