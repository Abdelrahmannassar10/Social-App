import { NextFunction, Request, Response,type Express } from 'express';
import { authRouter,userRouter } from './module';
import {connectDB} from './DB/';
import { AppError } from './utils';
export function bootstrap(app : Express,express :any) {
    connectDB();
   app.use(express.json());
   app.use("/auth", authRouter);
   app.use("/user",userRouter);
   app.use("/{*dummy}",(req,res)=>{
      res.status(404).json({message:"Route Not Found" ,success:false});
   });
   app.use((error : AppError ,req :Request ,res: Response ,next :NextFunction)=>{
      res.status(error.statusCode).json({message:error.message ,success :false ,errorDetails :error.errorDetails});
   });
 }
