import { IAttachment } from "../../utils";

export interface CommentDTO{
    content:string;
    attachment?:IAttachment
}