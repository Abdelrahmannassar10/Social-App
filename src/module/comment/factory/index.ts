import { IComment, IPost, IUser } from "../../../utils";
import { CreateCommentDTO } from "../comment.dto";
import { Comment } from "../entity";

export class CommentFactoryService{
    create(
        commentDTO:CreateCommentDTO,
        user:IUser,
        post:IPost,
        comment:IComment
    ){
        const newComment =new Comment() ;
        newComment.userId=user._id;
        newComment.postId=post._id;
        newComment.content=commentDTO.content;
        newComment.parentId=comment?._id;
        newComment.reactions =[];
        return newComment ;
    }
}