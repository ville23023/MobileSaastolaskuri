const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) =>{
    const authHeader = req.header("Authorization");
    if (authHeader == null) return res.status(401).json("Access denied");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded)=>{
        if(error){
            res.status(403).json("Invalid token");
        }else{
            req.user = decoded;
            next();
        }
    });
};
const admin = (req, res, next) =>{
    if(req.user.role !== 'admin'){
        res.status(403).json("Admin rights required");
}
next();
}
module.exports = {authenticate, admin};