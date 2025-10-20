import { IUser, REACTION } from "../../../utils";
import { Post } from "../entity";
import { CreatePostDTO, UpdatePostDTO } from "../post.dto";

export class PostFactoryService{
    create(createPostDTO:CreatePostDTO,user:IUser){
        const newPost =new Post;
        newPost.userId=user._id;
        newPost.content=createPostDTO.content;
        newPost.reactions=[]
        newPost.attachment=[]
        newPost.mentions=createPostDTO.mentions??[];
        return newPost ;
    }
    update(updatePostDTO:UpdatePostDTO){
        const newPost =new Post;
        newPost.content =updatePostDTO.content;
        newPost.mentions=updatePostDTO.mentions??[];
        return newPost ;
    }
}