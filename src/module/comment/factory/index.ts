import { IComment, IPost, IUser } from "../../../utils";
import { CommentDTO } from "../comment.dto";
import { Comment } from "../entity";

export class CommentFactoryService{
    create(
        commentDTO:CommentDTO,
        user:IUser,
        post:IPost,
        comment:IComment
    ){
        const newComment =new Comment() ;
        newComment.userId=user._id;
        newComment.postId=post._id;
        newComment.content=commentDTO.content;
        newComment.parentIds=comment ? [...comment.parentIds, comment._id]:[];
        newComment.reactions =[];
        return newComment ;
    }
}