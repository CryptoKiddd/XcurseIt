
const express = require('express');
const {getAllTours,postTour,getTourById,patchTour,deleteTour} = require('../controllers/tourController')

const router = express.Router()

// router.param('id',checkID)



router
.route('/')
.get(getAllTours)
.post(postTour);

router
.route('/:id')
.get(getTourById)
.patch(patchTour)
.delete(deleteTour);

module.exports = router