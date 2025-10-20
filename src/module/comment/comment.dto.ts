import { IAttachment } from "../../utils";

export interface CreateCommentDTO{
    content:string;
    attachment?:IAttachment;
};
export interface AddReactionDTO{
    reaction:string;
} ;
export interface UpdateCommentDTO{
    content:string;
    attachment?:IAttachment;
};