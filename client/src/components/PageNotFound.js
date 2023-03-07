import React from 'react'
//import Confirmation from './Confirmation'
import Lottie from 'lottie-react'
import * as botError from '../assets/bot-error.json'
import Backdrop from '@mui/material/Backdrop';


const PageNotFound = () => {

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

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      {/* <>{View}</> */}
      <Lottie animationData={botError} loop={true}  />
    </Backdrop>
  );

}

export default PageNotFound