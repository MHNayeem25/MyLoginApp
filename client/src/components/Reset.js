import React from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'
import { useAuthStore } from '../store/store';
import { resetPasswordValidation } from "../helper/validate";
import {resetPassword} from '../helper/helper'

const Reset = () => {

  const sessionToken = localStorage.getItem('sessionToken');
  console.log(sessionToken);
  const { username } = useAuthStore(state => state.auth);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: '',
      confirm_pwd: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // console.log(values);
      // console.log(username);
      let resetPromise = resetPassword({username, password:values.password});
      toast.promise(resetPromise,{
        loading: 'Updating...',
        success: <b>Reset Successfully...!</b>,
        error: <b>Could not Reset!</b>
      })
      //Remove session Token
      localStorage.removeItem('sessionToken');

      resetPromise.then( function() {navigate('/auth/password')});
    },
  });
  if(!sessionToken) { return <Navigate to='/' replace={true}/>}
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={ {width:'50%'}}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new Password.
            </span>
          </div>

          <form action="" className="py-20" onSubmit={formik.handleSubmit}>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="New Password"
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                className={styles.textbox}
                type="text"
                placeholder="Confirm Password"
              />

              <button className={styles.btn} type="submit">
                Reset
              </button>
            </div>

            
          </form>
        </div>
      </div>
    </div>
  );
}

export default Reset