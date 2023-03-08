import React from 'react'
//import Confirmation from './Confirmation'
import Lottie from 'lottie-react'
import * as botError from '../assets/bot-error.json'
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate();
  // const defaultOptions = {
  //   loop: false,
  //   autoplay: true,
  //   animationData: botError,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice'
  //   }
  // };
  // const style = {
  //   height: 300,
  // };
  // const options = {
  //   animationData: botError,
  //   loop: true,
  //   height: 100,
  //   width: 100, 
  // };

  //const { View } = useLottie(options,style);

  function goHome() {
    navigate('/');
  }

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      {/* <>{View}</> */}
      <div>
        <Lottie animationData={botError} loop={true} />
        <div className='flex justify-center'>
          <button onClick={goHome} class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Home
            </span>
          </button>        </div>
      </div>


    </Backdrop>
  );

}

export default PageNotFound