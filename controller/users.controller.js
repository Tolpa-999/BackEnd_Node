const asyncWrapper = require("../middlewares/asyncWrapper");
const Users = require("../models/users.model");
const appError = require("../utils/appError");
const httpStatus = require("../utils/httpStatusText")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT = require("../utils/generateJWT");
const getAllUsers = asyncWrapper(async (req, res) => {

    // console.log(req.headers);

    const query = req.query;
    const limit = query.limit || 2;
    const page = query.page || 1;
    const skip = (page - 1) * limit
    // const courses = await Course.find({ price: { $gte: 500 } }, { "__v": false });
    const users = await Users.find({}, { "__v": false, "password": false })
    // .limit(limit).skip(skip);
    // console.log(courses)

    res.json({ status: httpStatus.SUCESS, data: { users } })
})
const register = asyncWrapper(async (req, res, next) => {

    // console.log("req.file => ", req.file.filename);

    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await Users.findOne({ email: email })
    if (oldUser) {
        const error = appError.create("user already exist", 400, httpStatus.FAIL)
        return next(error)
    }

    const bcryotPass = await bcrypt.hash(password, 9)

    const newUser = new Users({
        firstName,
        lastName,
        email,
        password: bcryotPass,
        role,
        // avatar: req.file.filename
    })

    const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })

    // console.log("token => ", token);
    newUser.token = token;


    await newUser.save()



    res.status(201).json({ satus: httpStatus.SUCESS, data: { user: newUser } })
})
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = appError.create("email and password are required", 400, httpStatus.FAIL)
        return next(err)
    }

    const user = await Users.findOne({ email: email });
    if (!user) {
        const err = appError.create("user not found", 400, httpStatus.FAIL);
        return next(err)
    }

    const matchedPasseord = await bcrypt.compare
        (password, user.password)

    const token = await generateJWT({ email: user.email, id: user._id, role: user.role })

    if (matchedPasseord) {
        return res.status(200).json({ status: httpStatus.SUCESS, data: { token } })
    } else {
        const err = appError.create("password or username not true", 400, httpStatus.FAIL);
        return next(err)
    }

})

module.exports = {
    getAllUsers,
    register,
    login
}