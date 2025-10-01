import jwt, { JwtPayload } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
export const generateToken = ({
    payload,
    secretKey=devConfig.JWT_SECRET,
    options
}:{payload:object,secretKey?:string,options?:jwt.SignOptions})=>{
return  jwt.sign(payload, secretKey,options);
};
export const verifyToken =(token:string ,secretKey:string=devConfig.JWT_SECRET)=>{
return jwt.verify(token,secretKey) as JwtPayload;
}