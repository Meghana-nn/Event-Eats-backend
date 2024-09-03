const Enquiry=require('../models/enquiry-model')
const {validationResult}=require('express-validator')
const enquiryCtrl={}

enquiryCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const { customerId, catererId, message } = req.body;
        const enquiry = new Enquiry({ customerId, catererId, message});
        await enquiry.save();
        res.status(201).json(enquiry);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create enquiry' });
    }
}


enquiryCtrl.getById=async(req,res)=>{
    try{
        const { enquiryId } = req.params;
        const enquiry = await Enquiry.findById(enquiryId).populate('customerId catererId'); // Assuming customerId and catererId are references

        if (!enquiry) {
            return res.status(404).json({ error: 'Enquiry not found.' });
        }

        res.status(200).json(enquiry)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'faoled to get enquiry'})
    }
}

enquiryCtrl.update=async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const id=req.params.id
        const body=req.body
        const updateEnquiry=await Enquiry.findOneAndUpdate({_id:id},body,{new:true})
        res.json(updateEnquiry)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
    
}

enquiryCtrl.delete=async(req,res)=>{
    try {
        const  id  = req.params;
        const enquiry=await Enquiry.findByIdAndDelete({_id:id});
        if(!enquiry){
            return res.status(404).json({message:'not fount'})
        }
        res.json({ message: 'Enquiry deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete enquiry' });
    }
       
}

enquiryCtrl.list=async(req,res)=>{
    try {

        const enquiries = await Enquiry.find();
        res.status(200).json(enquiries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list enquiries' });
    }
}

enquiryCtrl.getEnquiryParticipants = async (req, res) => {
    const { customerId, catererId } = req.params;
    try {
        const messages = await Enquiry.find({
            customerId: customerId,
            catererId: catererId,
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
};

enquiryCtrl.getEnquiresByCaterer=async(req,res)=>{
    try{
        const { catererId } = req.params;  // Extract the catererId from the request parameters
        const enquiries = await Enquiry.find({ catererId });  // Query the database for enquiries related to this caterer

        if (!enquiries || enquiries.length === 0) {
            return res.status(404).json({ message: 'No enquiries found for this caterer' });
        }

        res.status(200).json(enquiries);
    }catch(err){
        console.error('Error fetching enquiries:', err);
        res.status(500).json({ error: 'Server error while fetching enquiries' }); 
    }
}

enquiryCtrl.response=async(req,res)=>{
   const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })

        }
        try{
            const id=req.params.id
            const {responses,}=req.body
            const responseEnquiry=await Enquiry.findByIdAndUpdate({_id:id},{responses},{new:true})
            res.json(responseEnquiry)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}


module.exports=enquiryCtrl