const Enquiry=require('../models/enquiry-model')
const {validationResult}=require('express-validator')
const enquiryCtrl={}

enquiryCtrl.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const enquiry = await Enquiry.create(req.body)
        res.status(200).json(enquiry)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
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
    try{
        const id =req.params.id
        const body=req
        const deleteEnquiry=await Enquiry.findOneAndDelete({_id:id},)
        res.json(deleteEnquiry)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}

enquiryCtrl.list=async(req,res)=>{
    try{
        const listEnquiry=await Enquiry.find()
        res.json(listEnquiry)

    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
enquiryCtrl.response=async(req,res)=>{
   const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })

        }
        try{
            const {_id,response,}=req.body
            const responseEnquiry=await Enquiry.findOneAndUpdate({_id},{response:response},{new:true})
            res.json(responseEnquiry)
    }catch(err){
        console.log(err)
        res.status(500).json({error:'something went wrong'})
    }
}
module.exports=enquiryCtrl