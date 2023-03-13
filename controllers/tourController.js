
const Tour = require('./../models/tourModel')


exports.aliasTopTours=(req,res,next)=>{
    req.query.limit='5';
    req.query.sort ='-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,sumamry,difficulty'
    next()
}

class APIFeatures {
    constructor(query,queryString){
        this.query = query,
        this.queryString = queryString

    }

    filter(){
         const queryObj = { ...this.queryString }
         const excludedFields = ['page', 'sort', 'limit', 'fields']
         excludedFields.forEach(el => delete queryObj[el])

    
         let queryStr = JSON.stringify(queryObj)
 
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
         
         this.query = this.query.find(JSON.parse(queryStr))
         return this
        
        

    }
    sort(){
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(" ")
            console.log(sortBy)
            this.query = this.query.sort(sortBy)

        } else {
            this.query = this.query.sort('-createdAt')
        }
      return this
    }
    limitFields(){
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else {
            query = query.select('-__v')
        }
        return this
    }
    paginate(){
        const page = this.queryString.page * 1 || 1;
        const limitBy = this.queryString.limit * 1 || 3
        const skipBy = (page - 1) * limitBy 
      
        this.query = this.query.skip(skipBy).limit(limitBy)
      
        return this
    }
    
}


exports.getAllTours = async (req, res) => {
    try {
        const features = new APIFeatures(Tour.find(),req.query).filter()
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