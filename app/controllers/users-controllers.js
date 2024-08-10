const User=require('../models/user-model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const usersCtrl = {}

usersCtrl.register = async(req,res) => {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body
        const user = new User(body)
        const salt = await bcryptjs.genSalt()
        const encryptedPassword = await bcryptjs.hash(user.password,salt)
        user.password = encryptedPassword
        await user.save()
        res.status(201).json(user)
        }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}
usersCtrl.login = async(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({arrays: errors.array})
    }
    try{
        const {body} = req
        const user = await User.findOne({email: body.email})
        if(!user){
            return res.status(404).json({error: 'invalid email/password'})
        }
        // res.json(user)
        const checkPassword = await bcryptjs.compare(body.password, user.password)
        if(!checkPassword){
            return res.status(404).json({error: 'invalid email/password'})
        }
        // res.json(user)
        const tokenData = {
            id : user._id,
            role: user.role
        }
        const token = jwt.sign(tokenData,process.env.JWT_SECRET)
        res.json({token: token})
    }catch(err){
        console.log(err)

    }
}
usersCtrl.account = async (req, res) => {
try {
        const user = await User.findById(req.user.id).select({ password: 0 })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json(user)
        console.log(req.user)
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

 usersCtrl.list=async(req,res)=>{
    
    try{
       const listUsers=await User.find().select({password:0})
       res.json(listUsers)
    }catch(err){
        res.status(500).json({error:'something went wrong'})
    }
}

module.exports = usersCtrl