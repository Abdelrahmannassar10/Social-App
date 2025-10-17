import { Schema } from "mongoose";
import { IPost } from "../../../utils";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";
import { string } from "zod";


export const postSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    reactions: [reactionSchema],
    mentions:[{
      type:String,
      trim:true
    }],
    deletedAt:{
      type:Date,
      default:undefined
    }
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
