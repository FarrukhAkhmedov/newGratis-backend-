const ApiError = require('../exeptions/api-error')

module.exports = function (err, req, res, next){
    console.log(err.message);
    if (err instanceof ApiError){
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json({message: 'Oops! Something went wrong!'})
}