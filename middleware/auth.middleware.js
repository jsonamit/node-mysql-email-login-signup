const jwt = require("jsonwebtoken");
const { publicRoutes, debugUsers } = require("../config/constant");

const authMiddleware = (req, res, next) => {
    // Check if current request is in public routes
    let isPublic  = false;

    isPublic = publicRoutes.includes(req.originalUrl)

    if (isPublic) {
        return next();
    }

    // Debug mode bypass
    if (process.env.DEBUG === 'True' && debugUsers.includes(req.mobile)) {
        // write some logic here
    }
    
    // JWT check
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
        return res.send({ resp: 0, msg: "No token provided", data: 'logout' });
    }

  const token = authHeader.split(" ")[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
        return res.json({ resp: 0, msg: "Invalid or expired token", data: 'logout' });
    }
    req.user = decoded; // attach decoded user info
    next();
  });
};

module.exports = authMiddleware;
