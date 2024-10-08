const Service = require('../models/service-model');
const Caterer=require('../models/caterer-model')
const {validationResult} = require('express-validator')
const serviceCtrl = {}
// Create a new service
serviceCtrl.createService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const catererId=req.user.id
        console.log(catererId)
        console.log('Caterer ID:', catererId);
        const serviceData=req.body
    
        // Find the caterer by ID
        const caterer = await Caterer.findOne({userId:catererId});
        if (!caterer) {
          return res.status(404).json({ error: 'Caterer not found' });
        }
    
        // Create the service with the caterer info
        const service = new Service({
          ...serviceData,
        //   catererId: caterer._id
          
        });
    
        await service.save();
        res.status(201).json({service,caterer});
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
       
    }



// Get all services
serviceCtrl.getAllServices = async (req, res) => {
    try {
        // const catererId=req.catererId
        const services = await Service.find().populate({path:'catererId',select:'name _id isVerified'})
        res.status(200).json(services);
        console.log(services)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Get a service by ID
serviceCtrl.getServiceById = async (req, res) => {
    try {
        const serviceId=req.params.id
        console.log(serviceId)
        
        if (!serviceId) {
            return res.status(404).json({ error: 'Service not found' });
        }
        const service = await Service.findById(serviceId)
        res.status(200).json({ service });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// Update a service by ID
serviceCtrl.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a service by ID
serviceCtrl.deleteService = async (req, res) => {
    try {
        const serviceId=req.params.id
        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// service-controller.js

serviceCtrl.getServicesByCatererId = async (req, res) => {
    try {
        const catererId=req.params.id
      const services = await Service.find({ catererId });
      if (!services) {
        return res.status(404).json({ message: 'No services found' });  // Use return to stop further execution
      }
      res.json(services);  // Send response
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Error fetching services' });  // Send error response
    }
  };
  

module.exports=serviceCtrl