import {z} from 'zod';
import { RegisterDTO } from './auth.dto';
import { Gender } from '../../utils';

export const registerSchema = z.object<RegisterDTO>({
    fullName:z.string().min(3).max(30) as unknown as string,
    email:z.email() as unknown as string,
    password:z.string().min(6).max(20) as unknown as string,
    phoneNumber:z.string() as unknown as string ,
    gender:z.enum(Gender) as unknown as Gender,
    dob:z.date() as unknown as Date,
    });