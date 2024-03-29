const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong Mongodb Id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Email ${Object.keys(err.keyValue)} already registered!`;
        err = new ErrorHandler(message, 400);
    }
    //wrong JWT error
    if (err.code === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, try again.`;
        err = new ErrorHandler(message, 400);
    }
    //Expired JWT token
    if (err.code === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again.`;
        err = new ErrorHandler(message, 400);
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message
        //message: err.stack
    })
}