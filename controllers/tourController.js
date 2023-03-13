const APIFeatures = require('../utils/apiFeatures')
const Tour = require('./../models/tourModel')


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,sumamry,difficulty'
    next()
}


exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {

        res.status(404).json({
            status: 'fail',
            message: 'not found'
        })

    }

}
exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'not found'
        })
    }





}
exports.postTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "invalid data sent"
        })
    }

}
exports.patchTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "invalid data sent"
        })
    }



}
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findOneAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            message: 'deleted successfully'
        })
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "tour was not found check the id"
        })
    }

}

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numOfTours: { $sum: 1 },
                    numOfRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },

            {
                $sort: { avgPrice: 1}
            },
           
           
        ])
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error
        })
    }
}