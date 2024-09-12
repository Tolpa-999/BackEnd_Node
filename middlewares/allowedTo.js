const appError = require("../utils/appError");

module.exports = (...roles) => {
    console.log("roles => ", roles);
    return (req, res, next) => {
        // console.log("req.currentUser.role => ",);
        if (!roles.includes(req.currentUser.role)) {
            return next(appError.create("this role isn't authorized", 401))
        }
        next();
    }
}