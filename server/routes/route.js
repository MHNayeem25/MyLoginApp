const express = require('express');

const router = express.Router();

const { registerUser, loginUser, getUserDetails, updateUserDetails, forgotPassword, resetPassword, logout, usernameAuth, verifyOtp} = require('../controller/userController');
const { isAuthenticatedUser, authCheck } = require('../middleware/auth');

router.route('/register').post(registerUser);

// router.route('/registerMail').post(); //Send the email

// router.route('/authenticate').post(); //authenticate user

router.route('/login').post(loginUser); //login in app
router.route('/auth/username').post(usernameAuth);   //check if user exist in db or not
//router.route('/auth/password').post(passwordAuth);   //check if password match or not


/** GET METHODs */
router.route('/me/auth').get(authCheck)    //Just check for logged in status
router.route('/me').post( getUserDetails)   //Get details of user with given username
router.route('/createResetSession').get()   //reset all the variables

//Password reset using otp
router.route('/password/forgot').post(forgotPassword)  //generate random OTP
router.route('/password/verify').post(verifyOtp)    //verify generated OTP




/** Put methods */
router.route('/me/update').put(updateUserDetails);  //is use to update the user profile
router.route('/me/password/reset').put(resetPassword); //use to change password

router.route("/logout").get(logout);


module.exports = router;