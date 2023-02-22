const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('tiny'));
app.disable('x-powered-by');


const user = require('./routes/route');



app.use("/api", user);


module.exports = app;
