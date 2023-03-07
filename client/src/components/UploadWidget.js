
const UploadWidget = () => {

  const cloudName = "hzxyensd5"; // replace with your own cloud name
  const uploadPreset = "aoh4fpwm"; // replace with your own upload preset
  let myWidget = window.cloudinary.createUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        
      }
    }
  );

  myWidget.open();
  
  
}

export default UploadWidget

