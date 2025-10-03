import { Schema } from "mongoose";
import { IPost, IReaction, REACTION } from "../../../utils";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";


export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
    //   required: function(){
    //     if(this.attachments?.length){
    //         return false
    //     }
    //     return true
    //   },
      trim: true,
    },
    reactions: [reactionSchema],
  },
  { timestamps: true ,toJSON:{virtuals:true} ,toObject:{virtuals:true} }
);
postSchema.virtual("comment",{
  localField:"_id",
  foreignField:"postId",
  ref:"Comment"
});
postSchema.pre("deleteOne",async function(){
  const filter =typeof this.getFilter == "function" ? this.getFilter() :{};
  await Comment.deleteMany({postId:filter._id});
})
