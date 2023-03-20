
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
    res.status(404).json({
        status:'fail',
        message:`cant find ${req.originalUrl} at the server`
    })
})

module.exports =app
