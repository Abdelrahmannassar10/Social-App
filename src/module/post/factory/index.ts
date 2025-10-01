import { IUser, REACTION } from "../../../utils";
import { Post } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactoryService{
    create(createPostDTO:CreatePostDTO,user:IUser){
        const newPost =new Post;
        newPost.userId=user._id;
        newPost.content=createPostDTO.content;
        newPost.reactions=[]
        newPost.attachment=[]
        return newPost ;
    }
    update(){

    }
}