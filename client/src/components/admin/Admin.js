import React, { useEffect, useState } from 'react'
import { getUsers } from '../../helper/helper';
import Entry from './Entry'
import toast,{ Toaster } from 'react-hot-toast';
import {logoutUser} from '../../helper/helper'
import { useAuthStore } from '../../store/store'
import {useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const Admin = () => {

  


  const navigate = useNavigate();
  const reset = useAuthStore(state => state.reset);
    const [data,setData] = useState([]);
    useEffect( ()=>{ 
    
      //Update: use token to authenticate
      const token = localStorage.getItem('token');

      if(token){
        const fetchData = async () => {
          const users = await getUsers();
          return users.data.users;
        };
        const fetchPr = fetchData();
        fetchPr.then((values) => {
          setData(values);
        })
        toast.promise(fetchPr, {
          loading: 'Please Wait...',
          success: <b>Recieved</b>,
          error: <b>Wrong Username</b>
        })
      }
      
    },[])

  function userLogout() {
    localStorage.removeItem('token');
    const logPromise = logoutUser();
    toast.promise(logPromise, {
      loading: 'Please Wait...',
      success: <b>LogOut Successfull!</b>,
      error: <b>Something Went Wrong!</b>
    })
    reset();
    navigate('/')
  }

if(data.length>0){

  return (

    

    <div className="">



      <Box  
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="outlined-basic" label="Search" variant="outlined" />
      </Box>


      <button type="button" onClick={userLogout} className="fixed right-px top-10	 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">LogOut</button>

    
    <div className="flex items-center justify-center overflow-x-auto shadow-md sm:rounded-lg mt-20 w-3/4 mx-auto mb-12" >
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              S.No
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-3 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>

          {data.map( (e, id) => {
              return <Entry key={e._id} id={id} mail={e.email}  user={e.username } />
            })}

        </tbody>
      </table>
    </div>
    </div>
  );
}
  
}

export default Admin