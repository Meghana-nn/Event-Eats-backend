const MenuCart=require('../models/menuCart-model')
const {validationResult}=require('express-validator')
const menuCartCtrl={}


menuCartCtrl.create = async(req, res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try {
        const cartItem = new MenuCart(req.body);
        await cartItem.save();
        res.status(201).send(cartItem);
      } catch (error) {
        res.status(400).send(error);
      }
}


menuCartCtrl.getById=async(req,res)=>{
    try{
        const cartItem=await MenuCart.findById(req.params.id)
        if(!cartItem){
            return res.status(400)
        }
        res.json(cartItem)

    }
    catch(err){
        res.status(400).json({error:'couldnot get menu cart'})
    }
}

menuCartCtrl.update=async(req,res)=>{
    try{
      
        const updateItem=await MenuCart.findByIdAndUpdate(req.params.id,{new:true,runValidators:true})
        if (!updateItem) {
            return res.status(404).json({ message: 'MenuCart item not found' });
          }
      
        res.json(updateItem)
       }catch(err){
    console.log(err)
    res.status(500).json({error:'could not update'})
}
}

menuCartCtrl.list = async (req, res) => {
    try {
      const menuCartItems = await MenuCart.find();
      res.json(menuCartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve menu cart items' });
    }
}


menuCartCtrl.remove=async(req,res)=>{
    try{
        const id=req.params.id
        const removeItem=await MenuCart.findByIdAndDelete({_id:id},body,{new:true})
        if (!deletedItem) {
            return res.status(404).json({ message: 'MenuCart item not found' });
          }
          res.json(removeItem)

    } catch(err){
        console.log(err)
        res.status(500).json({error:'could not remove item'})
    }
}

module.exports=menuCartCtrl