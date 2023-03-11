const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserDetails,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  logout,
  usernameAuth,
  verifyOtp,
  emailUser,
  allUsers,
  delPic,
  userExport,
} = require("../controller/userController");
const { isAuthenticatedUser, authCheck } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/registerMail").post(emailUser); //Send the email

// router.route('/authenticate').post(); //authenticate user

router.route("/login").post(loginUser); //login in app
router.route("/auth/username").post(usernameAuth); //check if user exist in db or not
//router.route('/auth/password').post(passwordAuth);   //check if password match or not

/** GET METHODs */
router.route("/me/auth").get(authCheck); //Just check for logged in status
router.route("/me").post(getUserDetails); //Get details of user with given username
router.route("/createResetSession").get(); //reset all the variables

/** Admin */
router.route("/admin").get(allUsers); //Get all users--admin
router.route("/export").get(userExport); //Export to csv file

//Password reset using otp
router.route("/password/forgot").put(forgotPassword); //generate random OTP
router.route("/password/verify").put(verifyOtp); //verify generated OTP

/** Put methods */
router.route("/me/update").put(updateUserDetails); //is use to update the user profile

router.route("/me/del/profile").put(delPic); //delete profile pic

router.route("/me/password/reset").put(resetPassword); //use to change password

router.route("/logout").get(logout);

module.exports = router;
