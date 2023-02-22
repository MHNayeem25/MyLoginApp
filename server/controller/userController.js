const User = require("../model/userModel");
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require('crypto')
const Mailgen = require('mailgen')

// Configure mailgen by setting a theme and your product info
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'LoginApp',
        link: 'https://LoginApp.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
    }
});


exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { username, email, password, profile } = req.body;

    //check if username exists
    const userPresent = await User.findOne({ username});
    if (userPresent) {
        return next(new ErrorHandler("Please use an unique username.", 404));
    }
    const emailPresent = await User.findOne({ email });
    if (emailPresent) {
        return next(new ErrorHandler("User already registered.", 404));
    }

    const message = {
        body: {
            name: username,
            intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };
    const emailBody = mailGenerator.generate(message);

    try{
        await sendEmail({
            email: user.email,
            subject: `Registration Successfull`,
            message: emailBody
        });
    }
    catch(error){
        return next(new ErrorHandler(error.message, 500));
    }
    const user = await User.create({
        username, email, password, profile
    });
    return sendToken(user, 200, res);
    
    
    
});

//Login User
exports.loginUser = catchAsyncErrors(async (req,res,next)=>{
    const {username,password} = req.body;
    if (!username || !password) {
        return next(new ErrorHandler("Please Enter Email & Password"));
    }
    //select password to remove password from being displayed
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    return sendToken(user, 200, res);
    //res.send();
    // const token = user.getJWTToken();
    // res.status(200).json({
    //     success: true,
    //     message: "Logged In",
    //     token
    // });
})

//get complete details of user if logged in
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.body.id);
    //console.log(user);
    //console.log(req.body.id);
    res.status(200).json({
        success: true,
        user
    });
});


//update user details
exports.updateUserDetails = catchAsyncErrors(async (req,res,next)=>{
    const curUsername = req.body.username;
    
    //check if username exists
    //const userPresent = await User.findOne({ username : curUsername });
    
    // if(!userPresent){
    //     return next(new ErrorHandler("Please use an unique username.", 404));
    // }
    //console.log(req.body);
    const newUserData = {
        firstName : req.body.firstName,
        address : req.body.address,
        profile : req.body.profile,
        lastName : req.body.lastName,
        mobile   : req.body.mobile,
        email   :  req.body.email,
    }
    //console.log(req.body.id);
    const user = await User.findByIdAndUpdate(req.body.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).catch(error =>{
        console.log(error);
    })
    //await user.save();
    return res.status(200).json({
        success: true
    });
})



//Forgot Password -- generate OTP
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    //console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    //console.log(user);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    //console.log(user);
    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    //console.log(resetToken);
    await user.save({ validateBeforeSave: false });
    try {
        const message = {
            body: {
                name: user.username,
                intro: `Your OTP is ${resetToken}. Verify and recover your password.`,
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        const emailBody = mailGenerator.generate(message);
        await sendEmail({
            email: user.email,
            subject: `Password Recovery`,
            message: emailBody
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
})

//Verify OTP
exports.verifyOtp = catchAsyncErrors(async (req,res,next) =>{
    //console.log(`user Input : ${req.body.otp}`);
    //const resetPasswordToken = req.body.otp;
    //console.log(`Recieved token : ${resetPasswordToken}`);
    //console.log(`verification time: ${Date.now()}`);
    const user = await User.findOne({
        resetPasswordToken : req.body.otp,
    }).exec();
    //console.log(`User token in db : ${user}`);

    //const sessionToken = 0 //generate token;
    const resetToken = crypto.randomBytes(20).toString("hex");
    //Hashing and add to userSchema
    const resetSessionToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has expired.", 404));
    }
    if(user.resetPasswordExpire < Date.now()){
        return next(new ErrorHandler("Reset Password Token is invalid or has expired.", 404));
    }
    //console.log('success');
    return res.status(200).json({
        success: true,
        message: "OTP matched",
        resetSessionToken
    });
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    
    //console.log(req.body);
    const username = req.body.username;
    const user = await User.findOne({
        username
    });
    if(!user){
        return next(new ErrorHandler("Unauthorised user."));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return sendToken(user, 200, res);
})




//update User Password
// exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
//     console.log(req.body);
//     console.log(req.user);
//     const user = await User.findById(req.user.id).select("+password");
//     const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

//     if (!isPasswordMatched) {
//         return next(new ErrorHandler("Old Password is incorrect", 401));
//     }
//     if (req.body.newPassword !== req.body.confirmPassword) {
//         return next(new ErrorHandler("Password does not match", 400));
//     }
//     user.password = req.body.newPassword;
//     await user.save();
//     sendToken(user, 200, res);
// });


//Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });



    return res.status(200).json({
        success: true,
        message: "Logged OUt"
    });
})


exports.usernameAuth = catchAsyncErrors(async (req,res,next) => {
    const {username} = req.body;
    if (!username) {
        return next(new ErrorHandler("Please Enter Username"));
    }
    //select password to remove password from being displayed
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        //return next(new ErrorHandler("Invalid username", 401));
        return res.status(401).json({
            success:false,
            message:'User not found'
        })
    }

    return res.status(200).json({
        success: true,
        message: "User found",
        user
    });
    //next();
    
    //sendToken(user, 200, res);

})

// exports.passwordAuth = catchAsyncErrors(async (req,res,next)=>{
//     const {username,password } = req.body;
//     if (!username || !password) {
//         return next(new ErrorHandler("Please Enter Username & Password"));
//     }
//     //select password to remove password from being displayed
//     const user = await User.findOne({ username }).select('+password');

//     if (!user) {
//         return next(new ErrorHandler("Invalid username or password", 401));
//     }
//     const isPasswordMatched = await user.comparePassword(password);
//     //  console.log(isPasswordMatched);
//     if (!isPasswordMatched) {
//         return next(new ErrorHandler("Invalid username or password", 401));
//     }
//     sendToken(user, 200, res);
// })