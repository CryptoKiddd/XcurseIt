
const express = require('express');
const {getAllTours,postTour,getTourById,patchTour,deleteTour,aliasTopTours, getTourStats} = require('../controllers/tourController')

const router = express.Router()

// router.param('id',checkID)

router.route('/tour-stats')
.get(getTourStats);
router.route('/top-5-cheap')
.get(aliasTopTours,getAllTours);

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