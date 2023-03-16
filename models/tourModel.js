const mongoose = require('mongoose')
const slugify = require('slugify')


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: [true, 'A tour must have name '],
        trim: true,
        maxLength: [40, 'Tour name must have max 40 characters  '],
        minLength: [5, 'Tour name must have min 5 characters  ']
    },
    slug: String,
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
        required: [true, 'A tour must have difficulty '],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: "Difficulty is either easy medium or difficult"
        }
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "rating must be above 1.0"],
        max: [5, "rating must be below 5.0"]
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    })

//middlewares
//virtual props
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
})
//document middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

//query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    next()
})

tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next()

})






const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;