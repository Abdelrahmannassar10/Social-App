import { CommentRepository, PostRepository } from "../../../DB";
import { NotFoundException } from "../../error";

export const addReactionProvider =async (
    repo:CommentRepository|PostRepository,
    id:string,
    userId:string,
    reaction:string
)=>{
    const postExist = await repo.exist({ _id: id });
    if (!postExist) {
      throw new NotFoundException("post not founded");
    }
    let userReactionIndex = postExist.reactions.findIndex((reaction) => {
      return reaction.userId.toString() == userId.toString();
    });
    if (userReactionIndex == -1) {
      await repo.update(
        { _id: id },
        {
          $push: {
            reactions: { reaction, userId },
          },
        }
      );
    } else if ([null, undefined, ""].includes(reaction)) {
      await repo.update(
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
      await repo.update(
        { _id: id, "reactions.userId": userId },
        {
          "reactions.$.reaction": reaction,
        }
      );
    }
}