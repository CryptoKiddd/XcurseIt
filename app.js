
const express = require('express')
const morgan = require('morgan')

//routes
const tourRouter = require('./routes/tourRoute')
const userRouter = require('./routes/userRoute')

const app = express()


//middlewares
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
 
}


app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


app.all('*',(req,res,next)=>{

    const err = new Error(`cant find ${req.originalUrl} at the server`)
    err.statusCode =404
    err.status = "fail"
    next(err)
})

app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    res.status(err.statusCode ).json({
        status:err.status,
        message:err.message
    })
    next()
})

module.exports =app
