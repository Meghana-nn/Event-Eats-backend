const { body } = require('express-validator');
const MenuItem = require('../models/menuItem-model');

const menuItemCtrl = {};

menuItemCtrl.create = async (req, res) => {
     console.log(req.file);
    try {
        const menuItemData = req.body;
        const menuItem = new MenuItem(menuItemData);
         menuItem.catererId = req.user.id;

        // If an image is uploaded, assign its path to menuItem
        if (req.file) {
            menuItem.itemImage = req.file.path;
        }

        // Save the menuItem to the database
        await menuItem.save();

        // Send a success response
        res.status(201).json(menuItem);
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
    }
};

module.exports = menuItemCtrl;
