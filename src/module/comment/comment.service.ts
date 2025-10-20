import { Request, Response } from "express";
import {
  AddReactionDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "./comment.dto";
import { CommentRepository, PostRepository } from "../../DB";
import {
  BadRequestException,
  IComment,
  IPost,
  NotFoundException,
  UnAuthorizedException,
} from "../../utils";
import { CommentFactoryService } from "./factory";
import { addReactionProvider } from "../../utils/common/providers/react.provider";

export class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  createComment = async (req: Request, res: Response) => {
    const { postId, id } = req.params;
    const commentDTO: CreateCommentDTO = req.body;
    const postExist = await this.postRepository.exist({ _id: postId });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    let commentExist: IComment | any = undefined;
    if (id) {
      commentExist = await this.commentRepository.exist({ _id: id });
      if (!commentExist) {
        throw new NotFoundException("comment not founded");
      }
    }
    const comment = this.commentFactoryService.create(
      commentDTO,
      req.user,
      postExist,
      commentExist
    );
    const createdComment = await this.commentRepository.create(comment);
    res
      .status(200)
      .json({ message: "done", success: true, data: { createdComment } });
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExist = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [{ path: "replies" }],
      }
    );
    if (!commentExist) {
      throw new NotFoundException("comment not founded");
    }
    if (commentExist.deletedAt)
      throw new BadRequestException("comment has been deleted");
    res
      .status(200)
      .json({ message: "done", success: true, data: { commentExist } });
  };
  deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExist = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [{ path: "postId", select: "userId" }],
      }
    );
    if (!commentExist) {
      throw new NotFoundException("comment not founded");
    }
    if (
      ![
        commentExist.userId.toString(),
        (commentExist.postId as unknown as IPost).userId.toString(),
      ].includes(req.user._id.toString())
    ) {
      throw new UnAuthorizedException(
        "you are not authorized to delete this comment"
      );
    }
    await this.commentRepository.delete({ _id: id });
    res
      .status(200)
      .json({ message: "comment deleted successfully", success: true });
  };
  addReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const AddReactionDTO: AddReactionDTO = req.body;
    const userId = req.user.id;
    await addReactionProvider(
      this.commentRepository,
      id,
      userId,
      AddReactionDTO.reaction
    );
    res.sendStatus(204);
  };
  freezeComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExist = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [{ path: "postId", select: "userId" }],
      }
    );
    if (!commentExist) {
      throw new NotFoundException("comment not founded");
    }
    if (
      ![
        commentExist.userId.toString(),
        (commentExist.postId as unknown as IPost).userId.toString(),
      ].includes(req.user._id.toString())
    ) {
      throw new UnAuthorizedException(
        "you are not authorized to delete this comment"
      );
    }
    await this.commentRepository.update(
      { _id: id },
      { $set: { deletedAt: new Date() } }
    );
    res
      .status(200)
      .json({ message: "comment has been soft deleted", success: true });
  };
  unfreezePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const commentExist = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [{ path: "postId", select: "userId" }],
      }
    );
    if (!commentExist) {
      throw new NotFoundException("comment not founded");
    }
    if (
      ![
        commentExist.userId.toString(),
        (commentExist.postId as unknown as IPost).userId.toString(),
      ].includes(req.user._id.toString())
    ) {
      throw new UnAuthorizedException(
        "you are not authorized to delete this comment"
      );
    }
    await this.commentRepository.update(
      { _id: id },
      { $set: { deletedAt: undefined } }
    );
    res
      .status(200)
      .json({ message: "comment has been retrieved", success: true });
  };
  updateComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateCommentDTO: UpdateCommentDTO = req.body;
    const commentExist = await this.commentRepository.getOne({ _id: id });
    if (!commentExist) {
      throw new NotFoundException("comment not founded");
    }
    if (
      ![
        commentExist.userId.toString(),
        (commentExist.postId as unknown as IPost).userId.toString(),
      ].includes(req.user._id.toString())
    ) {
      throw new UnAuthorizedException(
        "you are not authorized to delete this comment"
      );
    }
    await this.commentRepository.update(
      { _id: commentExist._id },
      { $set: { content: updateCommentDTO.content } }
    );
    res
      .status(200)
      .json({ message: "comment updated successfully", success: true });
  };
}
export default new CommentService();
