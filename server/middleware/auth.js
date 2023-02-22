const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('./catchAsyncErrors');
const User = require("../model/userModel");
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const {token} = req.cookies;
    //const {token} = req.
    if(!token){
        return next(new ErrorHandler("Please Login to access this resource."), 401);
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    //token saved in req.user
    req.user =  await User.findById(decodedData.id);
    
    next();
});

exports.authCheck = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource."), 401);
    }
    res.status(200).json({
        success: true,
    });
    
});

// exports.authrizeRoles = (...roles) =>{
//     return (req,res,next)=>{
//         if(!roles.includes(req.user.role)){
            
//             return next( new ErrorHandler(`Role: ${req.user.role} is not allowed to acces this resource`, 403));
//         }
//         next();
//     };
// }