
const Tour = require('./../models/tourModel')





exports.getAllTours = async (req, res) => {
    try {

        //BUILD A QUERY
        //1)  filtering
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //2)Advanced filtering

        //converting the query object to string because i want 
        //to replace gte|gt|lte|lt mongoose operators for filtering with $ sign in front
        //because it doesnt filter without that
        let queryStr = JSON.stringify(queryObj)

        //replacing  gte|gt|lte|lt with regex to $gte|$gt|$lte|$lt
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        // query database with object json.parse is converting previously converted string to object 
        let query = Tour.find(JSON.parse(queryStr))

        //sorting by the provided query if requested to sort if not sorting by creation
        if (req.query.sort) {
            let sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)

        } else {
            query = query.sort('-createdAt')
        }
        //filtering by fields

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        //pagination
        const page = req.query.page * 1 || 1;
        const limitBy = req.query.limit * 1 || 3
        const skipBy = (page - 1) * limitBy || 0
        console.log(skipBy)

        query = query.skip(skipBy).limit(limitBy)
        if (req.query.page) {
            const numOfTours = await Tour.countDocuments()
            console.log('rours',numOfTours)

            if (skipBy >= numOfTours) {
                 throw new Error("This page does not exist")
                 }
        }
        // GETTING THE RESULT FROM DB
        const tours = await query


        //SEND RESPONSE
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