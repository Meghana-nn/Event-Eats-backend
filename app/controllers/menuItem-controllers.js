const MenuItem = require('../models/menuItem-model');

// MenuItem controller object
const menuItemCtrl = {};

menuItemCtrl.create = async (req, res) => {
  try {
    // Access uploaded files' URLs
    const fileUrls = req.files ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`) : [];
   

    // Create a new menu item
    const menuItem = new MenuItem({
      catererId: req.user.id, // Ensure req.user.id is set correctly in your auth middleware
      name: req.body.name,
      itemType: req.body.itemType,
      menuImages: fileUrls // Use the file URLs in the itemImages field
    });

    // Save the menu item to the database
    await menuItem.save();

    // Send success response
    res.status(201).json({
      message: 'Files uploaded successfully',
      files: fileUrls,
      menuItem: menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({ message: 'Error creating menu item' });
  }
};

menuItemCtrl.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

menuItemCtrl.getMenuItemByCatererId = async (req, res) => {
  try {
    const catererId = req.user.id;
    const menuItems = await MenuItem.find({ catererId });
    if (!menuItems) {
      return res.status(404).json({ error: 'Menu items not found' });
    }
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

menuItemCtrl.listMenuItem = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

menuItemCtrl.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

menuItemCtrl.remove = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = menuItemCtrl;
