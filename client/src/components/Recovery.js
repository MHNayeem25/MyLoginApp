import React, { useEffect, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'
import { passwordValidate} from '../helper/validate'
import { verifyOtp, sendOtp} from '../helper/helper'
import { useAuthStore } from '../store/store'


const Recovery = () => {

  const navigate = useNavigate();


  const { username} = useAuthStore(state => state.auth);
  const [otp, setOtp] = useState();

  //to send otp
  useEffect( ()=>{
    //console.log("Otp sent");
      const pr = sendOtp(username);
      //console.log(pr);

      toast.promise(pr, {
        loading: 'Sending... Please Wait!',
        success: <b>OTP has been sent</b>,
        error: <b>Could not send</b>
      })
      pr.then();

  },[username])



  useFormik({
    initialValues: {
      otp: ''
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      //console.log(values)
    }
  })
  
  //fn onSubmit
  async function onSubmit(e){
    e.preventDefault();
    let pr =  verifyOtp(otp);
    toast.promise(pr, {
      loading: 'Verifying',
      success: <b>OTP has been Verified</b>,
      error: <b>Wrong OTP</b>
    })
    pr.then( value =>{
      //console.log(value.data.resetSessionToken);
      const sessionToken = value.data.resetSessionToken;
      //save token in local storage
      localStorage.setItem('sessionToken', sessionToken);
      return navigate('/reset');
      //'/reset/:token
    })
    
  }
  //Resend otp fn
  function resendOtp(){
    let sendPromise = sendOtp(username)
    toast.promise(sendPromise,{
      loading : 'Sending.. Please Wait!',
      success : <b>OTP has been sent</b>,
      error   : <b>Could not send</b>
    })
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>

          <form action="" className="py-20" onSubmit={onSubmit}>
            {/* <div className="profile flex justify-center py-4">
              <img className={styles.profile_img} src={avatar} alt="avatar" />
            </div> */}
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                  onChange={ (e) => setOtp(e.target.value)}
                />
              </div>
              

              <button className={styles.btn} type="submit">
                Recover
              </button>
            </div>
          </form>
          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP? <> </>
              <button className="text-red-500" onClick={resendOtp}>
                Resend OTP
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recovery