import React, { useEffect } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import styles from '../styles/Username.module.css'
import { profileValidation} from "../helper/validate";
//import convertToBase64 from '../helper/convert'
import { useState } from 'react'
import extend from '../styles/Profile.module.css';
import { useAuthStore } from '../store/store'
import { updateUser , logoutUser, getUsername, setProfileCloud, delProfileCloud} from '../helper/helper'

const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);
  //const [data,setExtraData ] = useState();
  const { username, profile , profile_id, mobile, email, firstName, lastName, address, id } = useAuthStore(state => state.auth);
  const setExtra = useAuthStore(state => state.setExtra);
  const setUsername = useAuthStore(state => state.setUsername);
  const setProfile = useAuthStore(state => state.setProfile);
  const reset = useAuthStore(state => state.reset);

  useEffect( ()=>{
    const token = localStorage.getItem('token');
    if (token){
      //use token is saved
      const fetchData = async () =>{
        const data = await getUsername();
        //console.log(data);
        //setExtraData(data);
        setExtra(data);
        setUsername(data.username);
        setProfile(data.profile);
        // console.log(username);
      }
      fetchData();
    }
  },[setExtra,setUsername,setProfile,file])
  
  const submitData = async( values, urlCloud) =>{
    values = await Object.assign(values,
      { profile: urlCloud ? urlCloud.data.secure_url : profile },
      { profile_id: urlCloud ? urlCloud.data.public_id : profile_id },
      { username: username }, { id: id });
    try{
      await updateUser(values);
      toast.success(<b>Update Successfull!</b>);
    } catch(error){
      console.log(error);
    }
    
    //console.log(values);
    // toast.promise(updatePromise, {
    //   loading: 'Please Wait...',
    //   success: <b>Update Successfull!</b>,
    //   error: <b>Something Went Wrong!</b>
    // })
    
    // updatePromise.then(()=>{}

    // ).catch();
  }

  //const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: firstName||'',
      lastName: lastName||'',
      email: email||"",
      mobile: mobile||'',
      address: address||'',
      profile: profile||'',
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize : true,
    onSubmit: async (values) => {
      try{        
        if(file){

          setOpen(true);
          if (profile_id) await delProfileCloud(profile_id);
          
          const urlCloud = await setProfileCloud(file);
          URL.revokeObjectURL(url) // free memory
          setUrl(urlCloud.data.secure_url);
          //save data
          await submitData(values,urlCloud);
          setFile('');

          setOpen(false);

        }else{
          setOpen(true);
          await submitData(values, null);
          setOpen(false);

        }
      }catch(error){
        return error;
      }
      
      
    },
  });

  
  // const widget = () => {
  //   const cloudName = "dr1ikq3ji"; // replace with your own cloud name
  //   const uploadPreset = "sm4htwrd"; // replace with your own upload preset
  //   let myWidget = window.cloudinary.createUploadWidget(
  //     {
  //       cloudName: cloudName,
  //       uploadPreset: uploadPreset
  //     },
  //     (error, result) => {
  //       if (!error && result && result.event === "success") {
  //         console.log("Done! Here is the image info: ", result.info);
  //         console.log(result.info.secure_url);
  //         setFile(result.info.secure_url);
  //         widget.close({ quiet: true });
  //       }
  //     }
  //   );
  //   myWidget.open();
  // }



  /** formik doesnot support file upload so we need to create this handler */
  // const onUpload = async e => {
  //   console.log(e);
  //   const base64 = await convertToBase64(e.target.files[0]);
  //   setFile(base64);
  // }

  const onUploadCloud = async e =>{
    //console.log(e.target.files[0].name);
    setFile(e.target.files[0]);
    if(url){
      URL.revokeObjectURL(url) // free memory
    }
    setUrl(URL.createObjectURL(e.target.files[0]) );
  }


  function userLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    const logPromise = logoutUser();
    toast.promise(logPromise, {
      loading: 'Please Wait...',
      success: <b>LogOut Successfull!</b>,
      error: <b>Something Went Wrong!</b>
    })
    reset();
    navigate('/')
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




      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update the details.
            </span>
          </div>

          <form action="" className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  className={`${styles.profile_img} ${extend.profile_img} `}
                  src={ profile? (url ? url:profile):(url ? url:avatar) }
                  alt="avatar"
                />
              </label>
              <input
                onChange={onUploadCloud}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="First Name"
                />

                <input
                  {...formik.getFieldProps("lastName")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Last Name"
                />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Mobile No."
                />

                <input
                  {...formik.getFieldProps("email")}
                  className={`${styles.textbox} ${extend.textbox}`}
                  type="text"
                  placeholder="Email"
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                className={`${styles.textbox} ${extend.textbox}`}
                type="text"
                placeholder="Address"
              />

              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later? <> </>
                <Link className="text-red-500" to="/" onClick={userLogout}>
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile