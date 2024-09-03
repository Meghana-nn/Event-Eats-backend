const Payment = require('../models/payment-model');
const MenuCart = require('../models/menuCart-model');
const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pick } = require('lodash');

const paymentsCtrl = {};

// Updated pay method
paymentsCtrl.pay = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    console.log('Request Body:', req.body);
    const { menuCartId, amount, customerId, menuCart, catererId, totalEventCost, noOfPeople } = req.body;
    const totalAmount = Number(amount);
    console.log('Total Amount:', totalAmount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
        return res.status(400).json({ error: 'Invalid total amount' });
    }

    // Ensure noOfPeople is a valid number
    const numberOfPeople = Number(noOfPeople);
    if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
        return res.status(400).json({ error: 'Invalid number of people' });
    }

    try {
        const menuCart = await MenuCart.findById(menuCartId).populate('menuItems services');
        if (!menuCart) {
            return res.status(404).json({ error: 'MenuCart not found' });
        }

        // Log individual menu items and services
        console.log('Menu Items:', menuCart.menuItems);
        console.log('Services:', menuCart.services);

        // Create a customer with Stripe
        const customer = await stripe.customers.create({
            name: 'Testing',
            address: {
                line1: 'India',
                postal_code: '517501',
                city: 'Tirupati',
                state: 'AP',
                country: 'US',
            },
        });

        // Prepare line items
        const lineItems = [
            ...menuCart.menuItems.map(item => {
                const amountPerPerson = Number(item.amount) || 0;
                const unitAmount = amountPerPerson*item.quantity * numberOfPeople * 100; // Convert to smallest currency unit
                if (isNaN(unitAmount) || unitAmount <= 0) {
                    console.error(`Invalid unit_amount for item ${item.name}: ${unitAmount}`);
                }
                console.log(`Item: ${item.name}, Amount per Person: ${amountPerPerson}, Total Amount: ${unitAmount}`);
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: item.name,
                            images: item.image ? [item.image] : [] // Include image URL if available
                        },
                        unit_amount: unitAmount // Use calculated unit_amount
                    },
                    quantity: 1 // Assuming 1 unit per menu item
                };
            }),
            ...menuCart.services.map(service => {
                const unitAmount = Number(service.totalEventCost) * 100; // Convert to smallest currency unit
                if (isNaN(unitAmount) || unitAmount <= 0) {
                    console.error(`Invalid unit_amount for service ${service.name}: ${unitAmount}`);
                }
                console.log(`Service: ${service.name}, Total Event Cost: ${service.totalEventCost}, Total Amount: ${unitAmount}`);
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: service.name,
                            description: service.description
                        },
                        unit_amount: unitAmount // Use totalEventCost for services
                    },
                    quantity: 1 // Assuming 1 unit of service
                };
            })
        ];

        // Log the line items for debugging
        console.log('Line Items:', lineItems);

        // Create a session object with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: 'http://localhost:3000/cancel',
            customer: customer.id 
        });

        // Create a payment record
        const payment = new Payment({
            menuCartId, // Updated field
            transactionId: session.id,
            paymentType: "card",
            amount: totalAmount,
            paymentStatus: "pending"
        });
        await payment.save();

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// successUpdate and failedUpdate methods remain unchanged
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
