import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'

// import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import {passwordLogin} from '../helper/helper'

const Password = () => {
  const navigate = useNavigate();
  //useFetch(`/`)
  
  const {username, profile} = useAuthStore(state => state.auth);
  const setExtra = useAuthStore(state => state.setExtra);
  //const setProfile = useAuthStore(state => state.setProfile);
  //console.log(data);
  //useFetch(`/user`)
  const formik = useFormik({
    initialValues: {
      password: '',
    },
    // validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      //console.log(values)
      let loginP =  passwordLogin({username, password:values.password});
      //console.log(loginP);
      // if(loginP.status===200){
      //   //toast.success("Successfull Login!", { duration: 6000 });
      //   navigate('/api/profile');
      // }
      // else{
      //   toast.error("Password Wrong");
      // }  
      toast.promise(loginP, {
        loading : 'Checking...',
        success : <b>Login Successfull!</b>,
        error   : <b>Password Wrong</b>
      })
      loginP.then(res =>{
        //console.log(res.token);
      //
      //
      //
      //set all other fields for profile page in our store
      //After verification
        setExtra(res);
      //
      //
        let {token, role} = res;
        localStorage.setItem('role',role);
        localStorage.setItem('token',token);
        if(role==='user'){
          navigate('/profile');
        }else{
          navigate('/admin');
        }
        
      })
      .catch(error =>{
        //toast.error("Password Wrong");
      })
      
    }
  })

  

  return (
    <div className="container mx-auto">
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Hello {username}</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us.
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img className={styles.profile_img} src={profile || avatar} alt={avatar} />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder="Password" autoComplete="off"/>
              <button className={styles.btn} type="submit">Sign In</button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password? <></>
                <Link className="text-red-500" to="/recovery">
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password