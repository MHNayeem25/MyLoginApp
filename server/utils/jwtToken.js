//Create Token and saved in cookie

const sendToken = (user,statusCode, res)=>{
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        expires: new Date(
            Date.now() +  1 *60*60*1000
        ),
        httpOnly:true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
        user,
        token
    })
}



module.exports = sendToken;