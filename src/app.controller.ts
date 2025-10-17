import { NextFunction, Request, Response,type Express } from 'express';
import { authRouter,userRouter ,postRouter, commentRouter } from './module';
import {connectDB} from './DB/';
import { AppError, globalErrorHandler } from './utils';
export function bootstrap(app : Express,express :any) {
    connectDB();
   app.use(express.json());
   app.use("/auth", authRouter);
   app.use("/user",userRouter);
   app.use("/post",postRouter);
   app.use("/comment",commentRouter)
   app.use("/{*dummy}",(req,res)=>{
      res.status(404).json({message:"Route Not Found" ,success:false});
   });
   app.use(globalErrorHandler);
 }
