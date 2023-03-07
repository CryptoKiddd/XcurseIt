const Tour = require('./models/tourModel');


exports.getAllTours = async(req,res)=>{
    //  basic and advanced fitlering
    // basic sorting and requested sorting
    // fields

    const queryObj = {...req.query}
    //exclude from query thing i want to do explicitly

    const toExcludeFromQuery = ['sort', 'field']
    toExcludeFromQuery.forEach(el=>delete queryObj[el])

    //modify query as to trigger mongodb operators   ?price[$gte]=1500
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g,match=> `$${match}`  )

    let query = Tour.find(JSON.parse(queryStr))

    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)

    }else{
       query = query.sort("-createdAt") 

    }
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)

    }else{
       query = query.sort("-__v") 

    }



    const tours  = await query

 
   

}