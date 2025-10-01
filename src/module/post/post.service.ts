import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { NotFoundException } from "../../utils";

class PostService {
  private readonly postRepository = new PostRepository();
  private readonly postFactoryService = new PostFactoryService();
  create = async (req: Request, res: Response) => {
    //create dto
    const createPostDTO: CreatePostDTO = req.body;
    //create factory , entity
    const post = this.postFactoryService.create(createPostDTO, req.user);
    //create in db
    const createdPost = await this.postRepository.create(post);
    //res
    return res.status(200).json({
      message: "post created successfully .",
      success: true,
      data: { createdPost },
    });
  };
  addReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    let userReactionIndex = postExist.reactions.findIndex((reaction) => {
      return reaction.userId.toString() == userId.toString();
    });
    if (userReactionIndex == -1) {
      await this.postRepository.update(
        { _id: id },
        {
          $push: {
            reactions: { reaction, userId },
          },
        }
      );
    } else if ([null, undefined, ""].includes(reaction)) {
      await this.postRepository.update(
        {
          _id: id,
        },
        {
          $pull: {
            reactions: postExist.reactions[userReactionIndex],
          },
        }
      );
    } else {
      await this.postRepository.update(
        { _id: id, "reactions.userId": userId },
        {
          "reactions.$.reaction": reaction,
        }
      );
    }

    res.sendStatus(204);
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
   const post =  await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName" },
          { path: "reactions.userId", select: "fullName" },
          {path:"comment",match:{parentIds:[]}}
        ],
      }
    );
    if(!post){
      throw new NotFoundException("post not founded")
    }
    res.status(200).json({message:"done",success:true,data:{post}})
  };
}
export default new PostService();
