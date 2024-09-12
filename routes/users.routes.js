const express = require('express')




const usersRoute = express.Router()

const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("FILE", file);
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === "image") {
        cb(null, true)
    } else {
        cb(appError.create("file must be image", 400), false)
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
})


const usersController = require('../controller/users.controller')
const verifyToken = require('../middlewares/verifyToken');
const appError = require('../utils/appError');

// get all users

// registet

// login

// get all courses
usersRoute.route('/')
    .get(verifyToken, usersController.getAllUsers)

usersRoute.route('/register')
    .post(upload.single('avatar'), usersController.register)

usersRoute.route('/login')
    .post(usersController.login)




module.exports = usersRoute;
