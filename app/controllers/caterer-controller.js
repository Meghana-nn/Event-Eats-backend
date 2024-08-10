const Caterer = require('../models/caterer-model')
const {validationResult} = require('express-validator')

const catererCtrl = {}

catererCtrl.createCatererService = async(req, res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body
        console.log(body)
        const existingCaterer = await Caterer.findOne({ userId: req.user.id });
        if (existingCaterer) {
            return res.status(400).json({ message: 'User already has a caterer.' });
        }

        const catererService = new Caterer(body)
        catererService.userId = req.user.id
        await catererService.save()
        res.status(201).json(catererService)    
    }
    catch(err){
        console.log(err)
        res.status(400).json(err.message)
    }
}
catererCtrl.verify = async(req,res) => {
    try{
        const catererId = req.params.id
        const caterer = await Caterer.findById(catererId)
        if (!caterer) {
            return res.status(404).json({ message: 'Caterer not found' })
        }
        if (caterer.isVerified) {
            return res.status(400).json({ message: 'Caterer is already verified' });
        }
        caterer.isVerified = true
        await caterer.save()
        console.log(caterer)
        res.status(200).json({ message: 'Caterer verified successfully' });
    }
    catch(err){
        res.status(400).json(err.message)
    }
},

catererCtrl.catererItems = async(req,res) => {
    try{
        const caterers = await Caterer.find()
        res.json(caterers)
    }
    catch(err){
        res.status(400).json(err.message)
    }
},
catererCtrl.catererByLocation = async(req, res) => {
    try{
        const {location} = req.params
        const caterers = await Caterer.find({location: location})
        res.status(200).json(caterers)
    }
    catch(err){
        res.status(400).json(err.message)

    }
},
catererCtrl.updateCaterer = async(req,res) => {
    try{
        const id = req.params.id
        const body = req.body
        const caterer = await Caterer.findOneAndUpdate({ _id: id }, body, { new: true })
        if (!caterer) {
            return res.status(404).json({ message: 'Caterer not found' });
        }
        res.json(caterers)
    }
    catch(err){
        res.status(400).json(err)
    }
},
catererCtrl.deleteCaterer = async(req,res) => {
    try{
        const id = req.params.id
        const body = req.body
        const caterers = await Caterer.findOneAndDelete({ _id: id }, body, { new: true })
        res.json(caterers)
    }
    catch(err){
        res.status(400).json(err)
    }
}


catererCtrl.getCatererById = async (req, res) => {
    try {
        const catererId = req.params.id;
        if (!catererId) {
            return res.status(400).json({ message: 'Caterer ID is required' });
        }

        const caterer = await Caterer.findById(catererId);
        if (!caterer) {
            return res.status(404).json({ message: 'Caterer not found' });
        }
        res.json(caterer);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

catererCtrl.getPendingCaterers = async (req, res) => {
    try {
        
        const pendingCaterers = await Caterer.find({isVerified:false})
        res.status(200).json(pendingCaterers);
    } catch (err) {
        console.error('Error fetching pending caterers:', err);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

catererCtrl.getVerificationStatus = async (req, res) => {
    try {
        const catererId = req.params.id;
        if (!catererId) {
            return res.status(400).json({ error: 'Caterer ID is missing' });
        }
        console.log('Caterer ID from token:', catererId);
        const caterer = await Caterer.findById(catererId);
        if (!caterer) {
            return res.status(404).json({ error: 'Caterer not found' });
        }
         res.status(200).json({ id: caterer._id, isVerified: caterer.isVerified });
    } catch (err) {
        console.error('Error fetching verification status:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller Method to get caterer by userId
catererCtrl.getCatererByUserId = async (req, res) => {
    try {
        const userId = req.user.id; 
      const caterer = await Caterer.findOne({ userId: userId });
        if (!caterer) {
            return res.status(404).json({ message: 'Caterer not found.' });
        }
        res.json(caterer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = catererCtrl;


  



