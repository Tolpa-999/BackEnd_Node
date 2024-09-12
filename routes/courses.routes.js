const express = require('express')
const { body } = require('express-validator')

const controllers = require('../controller/courses.controller.js')



const coursesRoutes = express.Router()
const validationSchema = require('../middlewares/validationSchema.js')
const { courses } = require('../data/courses.js')
const verifyToken = require('../middlewares/verifyToken.js')
const userRules = require('../utils/userRules.js')
const allowedTo = require('../middlewares/allowedTo.js')
// get all courses
coursesRoutes.route('/')
    .get(controllers.getAllCourses)
    .post(
        verifyToken,
        allowedTo(userRules.MANAGER),
        validationSchema(),
        controllers.addCourse
    )
// get single course
coursesRoutes.route('/:courseId')
    .get(controllers.getCourse)
    .patch(controllers.editCourse)
    .delete(
        verifyToken,
        allowedTo(userRules.ADMIN, userRules.MANAGER),
        controllers.deleteCourse)


module.exports = coursesRoutes;
