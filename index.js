require('dotenv').config()
const cors = require("cors")
const express = require('express');
const app = express();
const path = require('path')
app.use(cors())


const mongoose = require('mongoose')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const url = process.env.MONGO_URL;


mongoose.connect(url).then(() => {
    console.log("Connected succesfully")
})

const httpStatus = require("./utils/httpStatusText")

app.use(express.json())

const coursesController = require('./routes/courses.routes')
const usersController = require('./routes/users.routes.js')
app.use('/api/courses', coursesController)
app.use('/api/users', usersController)

app.all("*", (req, res) => {
    res.status(404).json({ status: httpStatus.ERROR, message: "resource not availble" })
})

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({ status: error.statusText || httpStatus.ERROR, message: error.message, code: error.statusCode || 500, data: null })
})



app.listen(process.env.PORT || 2000, () => {
    console.log("listening on port 2000")
})