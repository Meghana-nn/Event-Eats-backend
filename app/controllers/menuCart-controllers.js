const { validationResult } = require('express-validator');
const MenuCart = require('../models/menuCart-model');
const Event = require('../models/event-model');
const MenuItem = require('../models/menuItem-model');
const Service = require('../models/service-model');

const menuCartCtrl = {};

// Create a new menu cart
menuCartCtrl.create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { eventId, services, menuItems, catererId, customerId, totalAmount } = req.body;

        // Fetch event details
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Calculate totalEventCost based on services
        const totalEventCost = services.reduce((total, service) => {
            return total + (service.totalEventCost || 0); // Use service.totalEventCost if present
        }, 0);

        // Update services to include totalEventCost
        const updatedServices = services.map(service => ({
            ...service,
            totalEventCost:totalEventCost
        }));

        // Fetch menu items with amount
        const menuItemsWithAmount = await Promise.all(menuItems.map(async (item) => {
            const menuItem = await MenuItem.findById(item._id);
            if (!menuItem) {
                throw new Error(`Menu item with ID ${item._id} not found`);
            }
            return {
                ...item,
                amount: menuItem.amount,
                image: menuItem.menuImages[0] // Use the first image
            };
        }));

        const cartItem = new MenuCart({
            eventId,
            services: updatedServices,
            menuItems: menuItemsWithAmount,
            catererId,
            customerId,
            totalAmount,
            totalEventCost:totalEventCost, // Add totalEventCost to the cart
            eventName: event.name,
            noOfPeople: event.noOfPeople
        });

        await cartItem.save();
        res.status(201).json({ menuCart: cartItem });
    } catch (error) {
        console.error('Error creating cart:', error.message);
        res.status(500).json({ message: 'Error creating cart' });
    }
};

// Get menu cart by ID
menuCartCtrl.getById = async (req, res) => {
    try {
        const cartItem = await MenuCart.findById(req.params.id)
            .populate('menuItems', 'name quantity image amount')
            .populate('services', 'name description price');

        if (!cartItem) {
            return res.status(404).json({ message: 'MenuCart not found' });
        }
        res.json({ menuCart: cartItem });
    } catch (err) {
        console.error('Error fetching cart:', err.message);
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

// Get all menu carts for a specific customer
menuCartCtrl.getCartByCustomerId = async (req, res) => {
    try {
        const cartItems = await MenuCart.find({ customerId: req.params.id })
            .populate('menuItems', 'name quantity image amount')
            .populate('services', 'name description price');

        if (!cartItems.length) {
            return res.status(404).json({ message: 'No cart items found for this customer' });
        }

        res.json({ menuCart: cartItems });
    } catch (err) {
        console.error('Error fetching customer carts:', err.message);
        res.status(500).json({ message: 'Error fetching customer carts' });
    }
};

// Update a menu cart item by ID
menuCartCtrl.update = async (req, res) => {
    try {
        const updatedCart = await MenuCart.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCart) {
            return res.status(404).json({ message: 'MenuCart item not found' });
        }
        res.json(updatedCart);
    } catch (err) {
        console.error('Error updating cart:', err.message);
        res.status(500).json({ message: 'Error updating cart' });
    }
};

// List all menu carts
menuCartCtrl.list = async (req, res) => {
    try {
        const cartItems = await MenuCart.find()
            .populate('menuItems', 'name quantity image amount')
            .populate('services', 'name description price');

        res.json({ menuCart: cartItems });
    } catch (error) {
        console.error('Error listing carts:', error.message);
        res.status(500).json({ message: 'Error listing carts' });
    }
};

// Remove a menu cart item by ID
menuCartCtrl.remove = async (req, res) => {
    try {
        const removedItem = await MenuCart.findByIdAndDelete(req.params.id);
        if (!removedItem) {
            return res.status(404).json({ message: 'MenuCart item not found' });
        }
        res.json({ message: 'MenuCart item removed successfully' });
    } catch (err) {
        console.error('Error removing cart item:', err.message);
        res.status(500).json({ message: 'Error removing cart item' });
    }
};

module.exports = menuCartCtrl;
