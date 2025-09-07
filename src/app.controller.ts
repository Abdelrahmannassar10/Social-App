import {type Express } from 'express';
import  authRouter  from "./module/auth/auth.controller";
import connectDB from './DB/connection';
export function bootstrap(app : Express,express :any) {
    connectDB();
   app.use(express.json());
   app.use("/auth", authRouter);
   app.use("/{*dummy}",(req,res)=>{
      res.status(404).json({message:"Route Not Found" ,success:false});
   });
 }
