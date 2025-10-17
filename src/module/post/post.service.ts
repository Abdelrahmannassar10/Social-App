import { Request, Response } from "express";
import { PostRepository, UserRepository } from "../../DB";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { BadRequestException, NotFoundException, UnAuthorizedException } from "../../utils";
import { addReactionProvider } from "../../utils/common/providers/react.provider";
import { sendMail } from "../../utils/email";
import { devConfig } from "../../config/env/dev.config";

class PostService {
  private readonly postRepository = new PostRepository();
  private readonly postFactoryService = new PostFactoryService();
  private readonly userRepository = new UserRepository();
  create = async (req: Request, res: Response) => {
    //create dto
    const createPostDTO: CreatePostDTO = req.body;
    const user = await this.userRepository.getOne({ _id: req.user._id });
    //create factory , entity
    const post = this.postFactoryService.create(createPostDTO, req.user);
    //create in db
    const createdPost = await this.postRepository.create(post);
    if (createPostDTO.mentions && createPostDTO.mentions.length) {
      for (const email of createPostDTO.mentions) {
        await sendMail({
          to: email,
          subject: "You were mentioned in a post",
          html: devConfig.MENTIONS_BODY(user.firstName, createPostDTO.content),
        });
      }
    }
    //res
    return res.status(200).json({
      message: "post created successfully .",
      success: true,
      data: { createdPost },
    });
  };
  addReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const addReactionDTO: AddReactionDTO = req.body;
    const userId = req.user.toString();
    await addReactionProvider(
      this.postRepository,
      id,
      userId,
      addReactionDTO.reaction
    );
    res.sendStatus(204);
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await this.postRepository.getOne(
      { _id: id},
      {},
      {
        populate: [
          { path: "userId", select: "fullName" },
          { path: "reactions.userId", select: "fullName" },
          { path: "comment", match: { parentIds: null } },
        ],
      }
    );
    if (!post) {
      throw new NotFoundException("post not founded");
    }
    if(!post.deletedAt){
      throw new BadRequestException("post has been deleted")
    }
    res.status(200).json({ message: "done", success: true, data: { post } });
  };
  deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const postExist = await this.postRepository.getOne({ _id: id });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    if (postExist.userId.toString() != req.user._id.toString()) {
      throw new UnAuthorizedException(
        "you are not authorized to delete the post"
      );
    }
    await this.postRepository.delete({ _id: id });
    res
      .status(200)
      .json({ message: "post deleted successfully ", success: true });
  };
  freezePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    if (postExist.userId.toString() != req.user._id.toString()) {
      throw new UnAuthorizedException(
        "you are not authorized to delete the post"
      );
    };
    await this.postRepository.update({_id:id},{$set:{deletedAt:new Date()}});
    res.status(200).json({message:"post has been soft deleted", success:true});
  };
  unfreezePost =async (req: Request, res: Response) => {
    const { id } = req.params;
    const postExist = await this.postRepository.exist({ _id: id });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    if (postExist.userId.toString() != req.user._id.toString()) {
      throw new UnAuthorizedException(
        "you are not authorized to delete the post"
      );
    };
    await this.postRepository.update({_id:id},{$set:{deletedAt:undefined}});
    res.status(200).json({message:"post has been retrieved", success:true});
  };
}
export default new PostService();
