const Tour = require('./models/tourModel');


exports.getAllTours = async (req, res) => {
    //  basic and advanced fitlering
    // basic sorting and requested sorting
    // fields

    const queryObj = { ...req.query }
    //exclude from query thing i want to do explicitly

    const toExcludeFromQuery = ['sort', 'field']
    toExcludeFromQuery.forEach(el => delete queryObj[el])

    //modify query as to trigger mongodb operators   ?price[$gte]=1500
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    } else {
        query = query.sort("-createdAt")

    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)

    } else {
        query = query.select("-__v")

    }



    const tours = await query




}


class ApiGetReqFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filter() {
        const queryObj = { ...this.queryString }
        const toExclude = ['sort', 'limit', 'page', 'field']
        toExclude.forEach(el => delete queryObj[el])
        const queryStr = JSON.stringify(queryObj)
        queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        this.query = this.query(JSON.parse(queryStr))
        return this
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this
    }
    limitFields() {
        if (this.queryString.sort) {
            const fields = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(fields)
        } else {
            this.query = this.query.select("-__v")
        }
        return this
    }
    paginate() {
        const limitBy = this.queryString.limit * 1 || 1
        const page = this.queryString.page * 1 || 1
        const skipBy = (page - 1) * limitBy
        this.query = this.query.skip(skipBy).limit(limitBy)
        return this
    }
}