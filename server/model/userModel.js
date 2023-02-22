const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const otpGenerator = require('otp-generator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide unique Username'],
        maxLength: [10, 'Name cannot exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters'],
        unique: [true, "Username Exist"],
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email address"]
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minLength: [8, "password should be greater than 8 characters"],
        select: false
    },
    firstName: {type: String},
    lastName: {type: String},
    mobile : {type:Number},
    address: {type : String},
    profile: {type:String},
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    //const resetToken = crypto.randomBytes(5).toString("hex");
    const resetToken = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    //console.log(resetToken);

    //Hashing and add to userSchema (for verification by matching from params)
    this.resetPasswordToken = resetToken;

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    //console.log(`Data&Time saved in db --${Date.now() + 15 * 60 * 1000}`);
    //console.log(`Token saved in db --${this.resetPasswordToken}`);
    return resetToken;
}

module.exports = mongoose.model("User", userSchema)