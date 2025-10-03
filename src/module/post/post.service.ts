import { Request, Response } from "express";
import { PostRepository } from "../../DB";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { NotFoundException, UnAuthorizedException } from "../../utils";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

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
    const userId = req.user.id;
    await addReactionProvider(this.postRepository, id, userId, reaction);
    res.sendStatus(204);
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await this.postRepository.getOne(
      { _id: id },
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
}
export default new PostService();
