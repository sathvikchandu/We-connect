const express = require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute=require('./routes/users');
const app = express();
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts');
dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser  : true, useUnifiedTopology:true},()=>{
    console.log("connected to mongoose")
})

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/posts",postRoute) 


app.listen(5000,()=>{
    console.log('Server is running on port 5000');
})