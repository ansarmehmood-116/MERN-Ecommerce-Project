// const express=require("express");
// const color=require('colors');
//if we want to use es6 instead of above require package for importing packages so we can
//simply add the following variable in package.json simply go there and type the following
//package as "type":"module",  inside the project name below "main":"server.js", by default
//it is "common js" but after writing this statement it is change now simply use the following 
//statement like react, but in this case we must use extension with file path name e.g ".js",
//as in "const name=require('filePath')" we were not using file extension when we have to
//import any file but in case of import we must use extension.
import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from 'morgan'; //see details in 0-Notes.js
import connectDb from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes  from './routes/productRoutes.js';
import carouselRoutes from './routes/carouselRoutes.js';
import cors from 'cors';

//configure env
dotenv.config(); //as here it is in our root file that's why we donot add path other wise
                 //we should add the path as dotenv.config({path:'./directory'});.

//database cofig
connectDb();                 

//rest object
const app=express();

//Middleware
app.use(cors());
app.use(express.json()); //to getback data in json.
app.use(morgan('dev'));//it will give API details in console i.e, API type,status,and time
                       //when we call the API on server i.e localhost:8080

//middlewares                       
app.use('/api/v1/auth',authRoutes);                       
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/carousel',carouselRoutes);

//rest API's
app.get('/',(req,resp)=>{
     // resp.send({message:"welcome to e-commerce"}) //it is in object form
    resp.send("<h1>Welcome to e-commerce app</h1>");
})

//port
//her we will add dotenv or env it is a confidential file where we can store all our confidiential
//details so we create it and store our port,database url and also other important details
//to hide from visibility and not to expose so we will add npm i dotenv
// const PORT=8080; now it is hidden in .env file.
const PORT=process.env.PORT || 8080

//run listen
app.listen(PORT,()=>{
    console.warn(`server running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
});
