// let { courses } = require('../data/courses')
const { validationResult } = require('express-validator')

const Course = require('../models/course.model')

const httpStatus = require("../utils/httpStatusText");
const asyncWrapper = require('../middlewares/asyncWrapper');

const AppError = require("../utils/appError.js");
const appError = require('../utils/appError.js');

const getAllCourses = asyncWrapper(async (req, res) => {
    const query = req.query;
    console.log("Query => ", query);
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit
    // const courses = await Course.find({ price: { $gte: 500 } }, { "__v": false });
    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
    // console.log(courses)

    res.json({ status: "success", data: { courses } })
})
const getCourse = asyncWrapper(
    async (req, res, next) => {
        // const id = +req.params.courseId
        // const course = courses.find((ele) => ele.id === id)
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            const error = AppError.create("course not found", 400, httpStatus.FAIL)
            // console.log("error => ", AppError("course not found", 400, httpStatus.ERROR));
            console.log("pla");

            return next(error)
            // return res.status(404).json({ status: httpStatus.FAIL, data: { course: null } })
        }

        return res.json({ status: httpStatus.SUCESS, data: { course } })

        // try {
        //     } catch (err) {
        //     return res.status(400).json({ status: httpStatus.ERROR, data: null, message: err.message, code: 400 })
        // }
    }
)

const addCourse = asyncWrapper(async (req, res, next) => {
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatus.FAIL)
        return next(error)
        // return res.json({ status: httpStatus.FAIL, data: errors.array() })
    }
    // if (!req.body.title) {
    //     return res.status(400).json({ err: "title not provided" })
    // }
    // if (!req.body.price) {
    //     return res.status(400).json({ err: "price not provided" })
    // }

    // const newCourse = { id: courses.length + 1, ...req.body }
    // courses.push(newCourse)

    const newCourse = new Course(req.body)

    await newCourse.save();

    res.status(201).json({ status: httpStatus.SUCESS, data: { course: newCourse } })
})

const editCourse = asyncWrapper(async (req, res) => {
    const courseId = req.params.courseId;


    // let course = courses.find((ele) => ele.id === courseId)
    // if (!course) {
    //     return res.status(404).json({ msg: "course not founded" })
    // }
    // course = { ...course, ...req.body }
    // res.status(202).json(course);

    const UpdtateCourse = await Course.updateOne({ _id: courseId }, { $set: { ...req.body } })
    if (!UpdtateCourse) {
        const error = appError.create("id not found", 404, httpStatus.FAIL)
        // return res.status(404).json({ status: httpStatus.FAIL, data: { course: "id not found" } })
    }

    res.status(200).json({ status: httpStatus.SUCESS, data: { course: UpdtateCourse } });


    // try {

    // } catch (e) {
    //     res.status(400).json({ status: httpStatus.ERROR, data: null, message: e.message, code: 400 })
    // }

})

const deleteCourse = asyncWrapper(async (req, res) => {
    // const courseId = +req.params.courseId;
    // courses = courses.filter((ele) => ele.id !== courseId);
    // res.status(200).json({ msg: "deleted succesfully" })

    const courseId = req.params.courseId;
    const data = await Course.deleteOne({ _id: courseId });
    res.status(200).json({ status: httpStatus.SUCESS, data: null })

    // try {

    // } catch (error) {
    //     res.status(400).json({ status: httpStatus.FAIL, data: null, message: error.message, code: 400 })
    // }
})

module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    editCourse,
    deleteCourse,
}