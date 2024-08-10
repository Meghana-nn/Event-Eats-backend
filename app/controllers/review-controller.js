const Review = require('../models/review-model')
const {validationResult} = require('express-validator')
const reviewsCtrl = {}
const ratingsCtrl = {}

reviewsCtrl.create = async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        console.log(req)
        const body = req.body
        const id=req.params.catererId
        console.log('paramsId', req.params.catererId)
        const review = new Review(body)
        review.customerId = req.user.id
        console.log('User', req.user);
        review.catererId =id
        console.log('params', req.params);
        await review.save()
        res.status(201).json(review)
    } catch(err){
        console.log(err)
        res.status(500).json({errors : 'Internal Server Error'})
    }
}

reviewsCtrl.list = async(req, res)=>{
    try{
        const reviews = await Review.find()
        res.status(201).json(reviews)
    } catch(err){
        console.log(err)
        res.status(500).json({errors : 'Internal Server Error'})
    }
}
ratingsCtrl.create = async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    try{
        const {body} = req
        const rating = new Review(body)
        rating.customerId = req.user.id
        rating.catererId = req.params.catererId
        await rating.save()
        res.status(201).json(rating)
    } catch(err){
        console.log(err)
        res.status(500).json({errors : 'Internal Server Error'})
    }
}

ratingsCtrl.list = async(req, res)=>{
    try{
        const ratings = await Review.find()
        res.status(201).json(ratings)
    } catch(err){
        console.log(err)
        res.status(500).json({errors : 'Internal Server Error'})
    }
}

module.exports = {
    reviewsCtrl,
    ratingsCtrl
}
