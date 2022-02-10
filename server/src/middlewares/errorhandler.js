export const notFound = async (req, res, next) => {
    const error = new Error(`${req.originalUrl} Not Found`)
    res.status(404)
    next(error)
}

export const errorHandler = async (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let errorObject = {}
    
    if(process.env.NODE_ENV === 'development') {
        errorObject = {
            success:false,
            message:err.message ,
            code:statusCode,
            stack:err.stack
        }
    }else {
        errorObject = {
            success:false,
            message:err.message ,
            code:statusCode,
        }
    }
    res.status(statusCode).send(errorObject)
}
