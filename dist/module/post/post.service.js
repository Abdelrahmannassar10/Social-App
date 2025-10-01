"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_1 = require("../../utils");
class PostService {
    postRepository = new DB_1.PostRepository();
    postFactoryService = new factory_1.PostFactoryService();
    create = async (req, res) => {
        //create dto
        const createPostDTO = req.body;
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
    addReaction = async (req, res) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id;
        const postExist = await this.postRepository.exist({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        let userReactionIndex = postExist.reactions.findIndex((reaction) => {
            return reaction.userId.toString() == userId.toString();
        });
        if (userReactionIndex == -1) {
            await this.postRepository.update({ _id: id }, {
                $push: {
                    reactions: { reaction, userId },
                },
            });
        }
        else if ([null, undefined, ""].includes(reaction)) {
            await this.postRepository.update({
                _id: id,
            }, {
                $pull: {
                    reactions: postExist.reactions[userReactionIndex],
                },
            });
        }
        else {
            await this.postRepository.update({ _id: id, "reactions.userId": userId }, {
                "reactions.$.reaction": reaction,
            });
        }
        res.sendStatus(204);
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const post = await this.postRepository.getOne({ _id: id }, {}, {
            populate: [
                { path: "userId", select: "fullName" },
                { path: "reactions.userId", select: "fullName" },
                { path: "comment", match: { parentIds: [] } }
            ],
        });
        if (!post) {
            throw new utils_1.NotFoundException("post not founded");
        }
        res.status(200).json({ message: "done", success: true, data: { post } });
    };
}
exports.default = new PostService();
