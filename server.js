require('dotenv').config()
const express = require('express')
const {checkSchema} = require('express-validator')
const multer=require('multer')

const cors = require('cors')
const app = express()
const port = process.env.PORT || 3099

//middleware
const { authenticateUser, authorizeUser } = require('./app/middlewares/auth')

const usersCtrl = require('./app/controllers/users-controllers')
const catererCtrl = require('./app/controllers/caterer-controller')
const serviceCtrl=require('./app/controllers/service-controller')
const menuCtrl=require('./app/controllers/menuItem-controllers')
const enquiryCtrl=require('./app/controllers/enquiry-controllers')
const eventsCtrl=require('./app/controllers/events-controllers')
const menuCartCtrl=require('./app/controllers/menuCart-controllers')
const paymentsCtrl=require('./app/controllers/payment-controller')
const { reviewsCtrl,ratingsCtrl}=require('./app/controllers/review-controller')

const {userRegisterSchema, userLoginSchema} = require('./app/validations/user-validation')
const catererValidationSchema = require('./app/validations/caterer-validation')
const  enquiryValidationSchema=require('./app/validations/enquiry-validation')
const menuCartValidation=require('./app/validations/menuCart-validation')
const paymentSchema=require('./app/validations/payment-validation')
const reviewsSchema=require('./app/validations/review-validation')


const configureDB = require('./config/db')

configureDB()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './images');
    },
    filename: function (req, file, cb) {
     return  cb(null, Date.now() + '-' + file.originalname);
    }
  })
  const upload = multer({storage});


app.use(cors())
app.use(express.json())
app.use('/uploads',express.static('uploads'))




//user
app.post('/api/users/register',checkSchema(userRegisterSchema), usersCtrl.register)
app.post('/api/users/login', checkSchema(userLoginSchema), usersCtrl.login)
app.get('/api/users/account', authenticateUser, usersCtrl.account)
app.get('/api/users', usersCtrl.list)


//Caterer
app.post('/api/caterers', authenticateUser, authorizeUser(['caterer']), checkSchema(catererValidationSchema), catererCtrl.createCatererService)
app.put('/api/caterers/verify/:id', authenticateUser, authorizeUser(['admin']), checkSchema(catererValidationSchema), catererCtrl.verify)
app.get('/api/caterers', checkSchema(catererValidationSchema), catererCtrl.catererItems)
app.get('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.getCatererById)
app.put('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.updateCaterer)
app.delete('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.deleteCaterer)
app.post('/api/caterers/pending', authenticateUser, authorizeUser(['admin']), checkSchema(catererValidationSchema), catererCtrl.getPendingCaterers)
app.get('/api/caterers/status/:id', authenticateUser, authorizeUser(['caterer']),checkSchema(catererValidationSchema), catererCtrl.getVerificationStatus)



//service
app.post('/api/services',authenticateUser, authorizeUser(['caterer']),serviceCtrl.createService)
app.get('/api/services',serviceCtrl.getAllServices)
app.get('/api/services/:id',serviceCtrl.getAllServices)



//menuItem
app.post('/api/menuItem/upload', authenticateUser, authorizeUser(['caterer']), upload.single('itemImage'),menuCtrl.create)
app.post('/api/menuItem/upload',upload.array('itemImage',4), menuCtrl.create)


//enquiry
app.post('/api/customers/enquiries',authenticateUser,authorizeUser(['customer']),checkSchema(enquiryValidationSchema),enquiryCtrl.create)
app.put('/api/customers/enquiries/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.update)
app.get('/api/customers/enquires',checkSchema(enquiryValidationSchema),enquiryCtrl.list)
app.delete('/api/customers/enquiries/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.delete)

//response
app.put('/api/customers/response/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.response)


//event
app.post('/api/events/:catererId', authenticateUser, authorizeUser(['customer']), eventsCtrl.create)
app.get('/api/events',eventsCtrl.list)

 //menu cart item
app.post('/api/carts',authenticateUser,authorizeUser(['customer']),menuCartCtrl.create)
app.get('/api/carts',menuCartCtrl.list)
app.put('/api/carts/:id',checkSchema(menuCartValidation),menuCartCtrl.update)
app.delete('/api/carts/:id',checkSchema(menuCartValidation),menuCartCtrl.remove)


//payment
app.post('/api/payments',authenticateUser,authorizeUser(['customer']),checkSchema(paymentSchema),paymentsCtrl.pay)
app.post('/api/payments/success/:id', paymentsCtrl.successUpdate);
app.post('/api/payments/failed/:id', paymentsCtrl.failedUpdate);


//review
app.post('/api/reviews/:id', authenticateUser, authorizeUser(['customer']),checkSchema(reviewsSchema), reviewsCtrl.create)
app.get('/api/reviews', reviewsCtrl.list)
app.post('/api/ratings/:id', authenticateUser, authorizeUser(['customer']),checkSchema(reviewsSchema), ratingsCtrl.create )
app.get('/api/ratings', ratingsCtrl.list)



app.listen(port, () => {
    console.log('server running on port', port)
})
