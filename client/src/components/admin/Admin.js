import React, { useEffect, useState } from 'react'
import { getUsers } from '../../helper/helper';
import Entry from './Entry'
import toast, { Toaster } from 'react-hot-toast';
import { logoutUser, exportToCsv } from '../../helper/helper'
import { useAuthStore } from '../../store/store'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Page from './Page';

const Admin = () => {

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const reset = useAuthStore(state => state.reset);
  const [data, setData] = useState([]);
  const [page,setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);



  useEffect(() => {

    //Update: use token to authenticate
    const token = localStorage.getItem('token');

    if (token) {
      const fetchData = async (search) => {
        const users = await getUsers(search,page);
        return users.data;
      };
      const fetchPr = fetchData(search);
      fetchPr.then((values) => {
        setData(values.users);
        setPageCount(values.Pagination.pageCount);
        //console.log(values.Pagination.pageCount);
      })
      toast.promise(fetchPr, {
        loading: 'Please Wait...',
        success: <b>Recieved</b>,
        error: <b>Wrong Username</b>
      },{duration:500})
    }

  }, [search,page])


  //pagination
  //handle prev btn
  // const handlePrev = ()=>{
  //   setPage(()=>{
  //     if(page===1) return page;
  //     return page-1;
  //   })
  // }
  // //handle next btn
  // const handleNext = ()=>{
  //   setPage( ()=>{
  //     if(page===pageCount)  return pageCount;
  //     return page+1;
  //   })
  // }
  
  //Export User
  const exportUser = async()=>{
    const response = await exportToCsv(search);
    //console.log(response);
    if(response.status===200){
      window.open(response.data.downloadUrl, "blank");
    }else{
      toast.error("Error!");
    }
  }

  //Logout admin
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






  if (data.length === 0) {
    return (
      <div>
        <Box
          component=""
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="outlined-basic" label="Search" variant="outlined" onChange={(e) => setSearch(e.target.value)} />

        </Box>

        <button type="button" onClick={() => setSearch("")} className="fixed top-25 left-2.5	 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Reset</button>

        <button type="button" onClick={userLogout} className="fixed right-px top-10	 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">LogOut</button>

        </div>
    )
  }
  if (data.length > 0) {

    return (



      <div className="">



        <Box
          component=""
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField id="filled-basic" label="Search" variant="filled"   onChange={(e) => setSearch(e.target.value)} />
        </Box>

        <button type="button" onClick={() => setSearch("")} className=" top-25 left-2.5 ml-2.5	 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Reset</button>

        <button type="button" onClick={exportUser} className="fixed right-px text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Export as CSV</button>

        <button type="button" onClick={userLogout} className="fixed right-px top-10	 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">LogOut</button>


        <div className="flex items-center justify-center overflow-x-auto shadow-md sm:rounded-lg mt-15 w-3/4 mx-auto mb-12" >
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

            {
              data.map((e, id) => {
                return <Entry key={e._id} id={id+1+(page-1)*6} mail={e.email} user={e.username} />
              })
            }
            </tbody>
          </table>
        </div>
        <Page 
          pageCount={pageCount}
          page={page}
          setPage={setPage}
          />
      </div>
    );
  }

}

export default Admin