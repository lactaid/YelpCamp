// Importamos el módulo 'express' y lo asignamos a la variable 'express'
const express = require('express');

const router = express.Router();

const catchAsync = require('../utils/CatchAsync');

const ExpressError = require('../utils/ExpressError')

const Campground = require('../models/campground');

const {campgroundSchema} = require('../schemas');

const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');

const campgrounds = require('../controllers/campgrounds');



const multer  = require('multer');
const {storage} = require('../cloudinary/index')
const upload = multer({ storage});

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
    // .post(upload.array('image'), (req,res)=>{
    //     console.log(req.body, req.files)
    //     res.send("Yeah")
    // })

    router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;