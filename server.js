require('dotenv').config()

const bodyParser = require('body-parser');
const express = require('express')
const {checkSchema} = require('express-validator')
const multer=require('multer')
const path = require('path');
const fs=require('fs')
const http = require('http');
const { Server }= require('socket.io');



const cors = require('cors')
const app = express()
const port = process.env.PORT || 3099
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"]
  }

});


//middleware
const { authenticateUser, authorizeUser } = require('./app/middlewares/auth')

//controllers
const usersCtrl = require('./app/controllers/users-controllers')
const catererCtrl = require('./app/controllers/caterer-controller')
const serviceCtrl=require('./app/controllers/service-controller')
const enquiryCtrl=require('./app/controllers/enquiry-controllers')
const eventsCtrl=require('./app/controllers/events-controllers')
const menuCartCtrl=require('./app/controllers/menuCart-controllers')
const paymentsCtrl=require('./app/controllers/payment-controller')
const { reviewsCtrl,ratingsCtrl}=require('./app/controllers/review-controller')
const menuItemCtrl=require('./app/controllers/menuItem-controllers')

//validations
const {userRegisterSchema, userLoginSchema} = require('./app/validations/user-validation')
const catererValidationSchema = require('./app/validations/caterer-validation')
const  enquiryValidationSchema=require('./app/validations/enquiry-validation')
const menuCartValidation=require('./app/validations/menuCart-validation')
const paymentSchema=require('./app/validations/payment-validation')
const reviewsSchema=require('./app/validations/review-validation')
const menuItemValidation=require('./app/validations/menuItem-validation')

const configureDB = require('./config/db')

configureDB()

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
      const dir = './uploads';
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
      }
      callback(null, dir);
  },
  filename: (req, file, callback) => {
      callback(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
      callback(null, true);
  } else {
      callback(new Error('Only images are allowed'));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
  limits: { fileSize: 10000000 } // 10MB limit
});



// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({ customerId, catererId }) => {
      socket.join(`room-${customerId}-${catererId}`);
  });

  socket.on('sendMessage', (messageData) => {
      const { customerId, catererId, message } = messageData;
      io.to(`room-${customerId}-${catererId}`).emit('message', messageData);
  });

  socket.on('sendResponse', ({ enquiryId, response }) => {
      io.emit('response', { enquiryId, response }); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
      console.log('Client disconnected');
  });
});




app.use(cors())
app.use(express.json())
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.json());




//user
app.post('/api/users/register',checkSchema(userRegisterSchema), usersCtrl.register)
app.post('/api/users/login', checkSchema(userLoginSchema), usersCtrl.login)
app.get('/api/users/account', authenticateUser, usersCtrl.account)
app.get('/api/users', usersCtrl.list)
app.get('/api/customers',usersCtrl.listCustomers)


//Caterer
app.post('/api/caterers', authenticateUser, authorizeUser(['caterer']), checkSchema(catererValidationSchema), catererCtrl.createCatererService)
app.put('/api/caterers/verify/:id', authenticateUser, authorizeUser(['admin']), checkSchema(catererValidationSchema), catererCtrl.verify)
app.get('/api/caterers', checkSchema(catererValidationSchema), catererCtrl.catererItems)
app.get('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.getCatererById)
app.put('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.updateCaterer)
app.delete('/api/caterers/:id', checkSchema(catererValidationSchema), catererCtrl.deleteCaterer)
app.post('/api/caterers/pending', authenticateUser, authorizeUser(['admin']), checkSchema(catererValidationSchema), catererCtrl.getPendingCaterers)
app.get('/api/caterers/status/:id', authenticateUser, authorizeUser(['caterer']),checkSchema(catererValidationSchema), catererCtrl.getVerificationStatus)
app.get('/api/caterers/users/:id',checkSchema(catererValidationSchema),catererCtrl.getCatererByUserId)



//service
app.post('/api/services',authenticateUser, authorizeUser(['caterer']),serviceCtrl.createService)
app.get('/api/services/caterer/:id',serviceCtrl.getServicesByCatererId)
app.get('/api/services',serviceCtrl.getAllServices)
app.get('/api/services/:id',serviceCtrl.getServiceById)
app.put('/api/services/:id',serviceCtrl.updateService)
app.delete('/api/services/:id',serviceCtrl.deleteService)



//menuItem
app.post('/api/menuItem/upload', authenticateUser, authorizeUser(['caterer']), upload.array('menuImages',10),menuItemCtrl.create)
app.get('/api/menuItem/caterer/:id', menuItemCtrl.getMenuItemByCatererId);
app.put('/api/menuItem/:id',checkSchema(menuItemValidation),menuItemCtrl.updateMenuItem)
app.get('/api/menuItem/:id',checkSchema(menuItemValidation),menuItemCtrl.getMenuItem)
app.get('/api/menuItem',checkSchema(menuItemValidation),menuItemCtrl.listMenuItem)
app.delete('/api/menuItem/:id',checkSchema(menuItemValidation),menuItemCtrl.remove)




//enquiry
app.post('/api/enquiries',authenticateUser,authorizeUser(['customer'],['caterer']),checkSchema(enquiryValidationSchema),enquiryCtrl.create)
app.put('/api/enquiries/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.update)
app.get('/api/enquiries',checkSchema(enquiryValidationSchema),enquiryCtrl.list)
app.delete('/api/enquiries/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.delete)
app.get('/api/enquiries/:id', enquiryCtrl.getById)


app.get('/api/enquiries/caterer/:catererId',enquiryCtrl.getEnquiresByCaterer)
app.get('/api/enquiries/messages/:customerId/:catererId',enquiryCtrl.getEnquiryParticipants);
app.put('/api/enquiries/response/:id',checkSchema(enquiryValidationSchema),enquiryCtrl.response)




//event
app.post('/api/events/:catererId', authenticateUser, authorizeUser(['customer']), eventsCtrl.create)
app.get('/api/events',eventsCtrl.list)
app.get('/api/events/:id',eventsCtrl.getEventById)
app.get('/api/events/customer/:id', eventsCtrl.getByCustomerId)
app.put('/api/events/:id',eventsCtrl.update)
app.delete('/api/events/:id',eventsCtrl.delete)

 //menu cart item
app.post('/api/carts',authenticateUser,authorizeUser(['customer']),menuCartCtrl.create)
app.get('/api/carts',menuCartCtrl.list)
app.get('/api/carts/:id',checkSchema(menuCartValidation),menuCartCtrl.getById)
app.get('/api/carts/customer/:id',checkSchema(menuCartValidation),menuCartCtrl.getCartByCustomerId)
app.put('/api/carts/:id',checkSchema(menuCartValidation),menuCartCtrl.update)
app.delete('/api/carts/:id',checkSchema(menuCartValidation),menuCartCtrl.remove)


//payment
app.post('/api/create-checkout-session',paymentsCtrl.pay)
app.put('/api/payments/success/:id', paymentsCtrl.successUpdate);
app.put('/api/payments/failed/:id', paymentsCtrl.failedUpdate);


//review
app.post('/api/reviews/:id', authenticateUser, authorizeUser(['customer']),checkSchema(reviewsSchema), reviewsCtrl.create)
app.get('/api/reviews', reviewsCtrl.list)
app.post('/api/ratings/:id', authenticateUser, authorizeUser(['customer']),checkSchema(reviewsSchema), ratingsCtrl.create )
app.get('/api/ratings', ratingsCtrl.list)



server.listen(port, () => {
    console.log('server running on port', port)
})
