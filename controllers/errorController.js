const AppError = require("../utils/appError")

 const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(val=>val.message)
    const message = `Invalid Input Data ${errors.join('. ')}`
    return new AppError(message,400)
 }

 const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}` 

    return new AppError(message,400)
 }


 const handleDuplicateFieldsDB = err =>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate Fields Value: ${value}, Please use another value`;


    return new AppError(message,400)

 }

const sendErrorDev = (err,res)=>{

    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack:err.stack
    })
}
const sendErrorProd = (err,res)=>{
    
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,       
            message: err.message,
        })

    }else{
        console.error('Error:',err)
        res.status(500).json({
            status:'error',
            message:'Something went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,res)
    }else if (process.env.NODE_ENV==='production'){
        let errorCopy = {...err}
        
        if(errorCopy.name === "CastError"){
            errorCopy =  handleCastErrorDB(errorCopy) 
        }  
        
        if(errorCopy.code === 11000){
            errorCopy =  handleDuplicateFieldsDB(errorCopy) 
        }  
        if(errorCopy.name === "ValidationError"){
            errorCopy =  handleValidationErrorDB(errorCopy) 
        }  
        sendErrorProd(errorCopy,res)
    }

   
 
}