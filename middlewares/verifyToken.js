// const { message } = require("../utils/appError");

const jwt = require('jsonwebtoken')
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json("Token is required");
    }

    const token = authHeader.split(' ')[1];
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // console.log("Decoded => ", currentUser);
        req.currentUser = currentUser
        return next();
    } catch (error) {
        return res.status(401).json({ message: "invalid token", err: error.message });
    }
    // console.log("Token => ", token);
    // return next();
}

module.exports = verifyToken