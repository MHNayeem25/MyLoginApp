const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const app = express();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_kEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});
const corsConfig = {
    credentials: true,
    origin: true,
};
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
//app.use(morgan('tiny'));
app.disable('x-powered-by');
app.use("/files",express.static("./public/files"));


const user = require('./routes/route');



app.use("/api", user);


module.exports = app;
