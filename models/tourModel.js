const mongoose = require('mongoose')
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: [true, 'A tour must have name '],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have Duration ']
    },
    maxGroupSize: {
        type: Number,
        require: [true, 'A tour must have group size ']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty ']
    },

    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have price ']
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have description ']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have cover image ']

    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
},
    {
        toJSON: {virtuals: true },
        toObject: {virtuals: true }

    })

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour