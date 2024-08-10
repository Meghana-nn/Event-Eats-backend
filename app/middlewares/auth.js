const jwt = require('jsonwebtoken')
const authenticateUser = (req,res,next)=>{
    const token = req.headers['authorization']
    if(!token){
        return res.status(401).json({error: 'token is required'})
    }
    try{
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        console.log(tokenData) 
        req.user = {
            id: tokenData.id,
            role: tokenData.role
        }
        console.log(req.user)
        next()
    }
    catch(err){
        console.log(err)
        return res.status(401).json({error: err.message})

    }
}

const authorizeUser = (role) => {
    return (req, res, next) => {
            console.log('User role:', typeof(req.user.role))
        if(role.includes((req.user.role).toString())){
            next()
        }else{
            console.log(err)
            res.status(403).json({error:'you are not authorize to access this route'})
        }
    }
}

module.exports = {
    authenticateUser,
    authorizeUser
}



