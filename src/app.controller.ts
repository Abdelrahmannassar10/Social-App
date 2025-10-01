import { NextFunction, Request, Response,type Express } from 'express';
import { authRouter,userRouter ,postRouter } from './module';
import {connectDB} from './DB/';
import { AppError } from './utils';
export function bootstrap(app : Express,express :any) {
    connectDB();
   app.use(express.json());
   app.use("/auth", authRouter);
   app.use("/user",userRouter);
   app.use("/post",postRouter);
   app.use("/{*dummy}",(req,res)=>{
      res.status(404).json({message:"Route Not Found" ,success:false});
   });
   app.use((error : AppError ,req :Request ,res: Response ,next :NextFunction)=>{
   //  console.log(error);
    
      res.status(error.statusCode||500).json({message:error.message ,success :false ,errorDetails :error.errorDetails});
   });
 }
