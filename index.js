const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv")
const connectdb=require('./config/db');

const app=express();
dotenv.config({path: './config/config.env'});
connectdb();
//body parser
app.use(express.json());
app.use(cors());

const PORT=process.env.PORT || 5000
app.listen(PORT,()=>console.log(`server started on port${PORT}`));

//routes
//this is the routes to interact with backend
//the route would be http://localhost:3000/users/login 
//login is end point
app.use("/users",require("./routes/userRouter"))