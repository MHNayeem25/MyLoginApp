import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'
import { registerValidation } from "../helper/validate";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react'
import { registerUser, setProfileCloud } from '../helper/helper'
import { useLottie } from 'lottie-react'
import * as greenTick from '../assets/green-tick.json'

const Register = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [animation, setAnimation] = useState(false);

  const submitData = async (values, urlCloud) => {
    values = await Object.assign(values, { profile: urlCloud ? urlCloud.data.secure_url : "" },
      { profile_id: urlCloud ? urlCloud.data.public_id : "" });
    await registerUser(values);

  }

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {

      setOpen(true);

      if (file) {
        try {
          const urlCloud = await setProfileCloud(file);
          await submitData(values, urlCloud);
          setOpen(false);
          setAnimation(true);
          setTimeout(() => {
            //setAnimation(false);
            navigate('/');
          }, 1200)
        } catch (error) {
          console.log(error);
          toast.error(<b>Could not Register.</b>);
        }

      } else {
        try {
          await submitData(values, null);
          setOpen(false);
          setAnimation(true);
          setTimeout(() => {
            //setAnimation(false);
            navigate('/');
          }, 1200)
        } catch (error) {
          console.log(error);
          toast.error(<b>Could not Register.</b>)
          setOpen(false);
        }

      }

    },
  });


  const style = {
    height: 300,
  };
  const options = {
    animationData: greenTick,
    loop: true,
    height: 100,
    width: 100,
    autoplay: true,
  };
  const { View } = useLottie(options, style);


  /** formik doesnot support file upload so we need to create this handler */
  const onUpload = async e => {
    //console.log(e);
    //const base64 = await convertToBase64(e.target.files[0]);
    setFile(e.target.files[0]);
    // if (url) {
    //   URL.revokeObjectURL(url) // free memory
    // }
    setUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div className="container mx-auto">

      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={animation}
        >
           <>{View}</>
        </Backdrop>
      </div>

      

      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass} style={{ width: "45%" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us.
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  className={styles.profile_img}
                  src={url || avatar}
                  alt="avatar"
                />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="text"
                placeholder="Email"
              />
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Sign Up
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Registered? <></>
                <Link className="text-red-500" to="/login">
                  Sign In
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register