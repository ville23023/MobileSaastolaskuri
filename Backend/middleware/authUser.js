const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) =>{
    const authHeader = req.header("Authorization");
    if (authHeader == null) return res.status(401).json("Access denied");
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded)=>{
        if(error){
            res.status(403).json("Invalid token");
        }else{
            next();
        }
    });
};

module.exports = authenticate;