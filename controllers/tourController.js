const APIFeatures = require('../utils/apiFeatures')
const Tour = require('./../models/tourModel')

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,sumamry,difficulty'
    next()
}


exports.getAllTours = catchAsync(async (req, res,next) => {
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
})

exports.getTourById =catchAsync(async (req, res,next) => {
    const tour = await Tour.findById(req.params.id)
    if(!tour){
       return next(new AppError('No Tour Found with that id',404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})


exports.postTour =catchAsync(async(req, res,next) => {
    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
  

})
exports.patchTour = catchAsync(async (req, res,next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
       if(!tour){
       return next(new AppError('No Tour Found with that id',404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})
exports.deleteTour =catchAsync(async (req, res,next) => {
    const tour = await Tour.findOneAndDelete(req.params.id);
    if(!tour){
        return next(new AppError('No Tour Found with that id',404))
     }
    res.status(204).json({
        status: 'success',
        message: 'deleted successfully'
    })
   

})

exports.getTourStats =catchAsync(async (req, res,next) => {
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
            $sort: { avgPrice: -1 }
        },

    ])
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getMontlyPlan =catchAsync(async (req, res) => {
    const year = req.params.year * 1
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),

                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numOfTourStarts: {$sum: 1 },
                    tours:{$push:'$name'}
                }
            },
            {
                $addFields: {
                    month: "$_id"
                }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {
                    numOfTourStarts:-1
                }
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })

})