import { Request, Response } from "express";
import { CommentDTO } from "./comment.dto";
import { CommentRepository, PostRepository } from "../../DB";
import { IComment, NotFoundException } from "../../utils";
import { CommentFactoryService } from "./factory";

export class CommentService {
    private readonly postRepository = new PostRepository;
    private readonly commentRepository = new CommentRepository;
    private readonly commentFactoryService = new CommentFactoryService() ;
    createComment =async(req:Request,res:Response)=>{
        const{postId , id}=req.params;
        const commentDTO:CommentDTO =req.body;
        const postExist= await this.postRepository.exist({_id:postId});
        if(!postExist){
            throw new NotFoundException("post not founded");
        };
        let commentExist :IComment|any =undefined;
        if(id){
            commentExist= await this.commentRepository.exist({_id:id});
            if(!commentExist){
                throw new NotFoundException("comment not founded");
            };
        }
        const comment = this.commentFactoryService.create(commentDTO,req.user,postExist,commentExist);
        const createdComment =await this.commentRepository.create(comment);
        res.status(200).json({message:"done",success:true ,data:{createdComment}});
    };
};
export default new CommentService() ;