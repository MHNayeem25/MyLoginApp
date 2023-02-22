import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import {Toaster} from 'react-hot-toast'
import {useFormik} from 'formik'
import styles from '../styles/Username.module.css'
import { usernameValidate } from '../helper/validate'
import {useAuthStore} from '../store/store'
import { getUserProfile, getUsername} from '../helper/helper'

const Username = () => {
  //send to a different route
  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername);
  const setProfile = useAuthStore(state => state.setProfile);
  const { username, profile } = useAuthStore(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      //use token is saved
      const fetchData = async () => {
        const data = await getUsername();
        //console.log(data);
        setUsername(data.username);
        setProfile(data.profile);
        // console.log(username);
      }
      fetchData();
    }
  }, [setProfile,setUsername])

  const formik = useFormik({
    initialValues:{
      username : username||''
    },
   validate : usernameValidate,
    validateOnBlur : false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit : async values => {
      // console.log(values);
      //console.log(data);
      const userData = getUserProfile(values.username);
      //  console.log(data);
      userData.then(res =>{
        //console.log(res.data.user.profile);
        setProfile(res.data.user.profile);
      })
      setUsername(values.username);
      
      navigate('/auth/password');
    }
  })

  
  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello Again</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us.
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img className={styles.profile_img} src={profile || avatar} alt="avatar" />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder="Username" />
              <button className={styles.btn} type="submit">Let's Go</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Not a Member <></>
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Username