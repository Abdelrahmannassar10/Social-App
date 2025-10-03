"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_1 = require("../../utils");
const react_provider_1 = require("../../utils/common/providers/react.provider");
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
        const userId = req.user.id;
        await (0, react_provider_1.addReactionProvider)(this.postRepository, id, userId, reaction);
        res.sendStatus(204);
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const post = await this.postRepository.getOne({ _id: id }, {}, {
            populate: [
                { path: "userId", select: "fullName" },
                { path: "reactions.userId", select: "fullName" },
                { path: "comment", match: { parentIds: null } },
            ],
        });
        if (!post) {
            throw new utils_1.NotFoundException("post not founded");
        }
        res.status(200).json({ message: "done", success: true, data: { post } });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const postExist = await this.postRepository.getOne({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        if (postExist.userId.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not authorized to delete the post");
        }
        await this.postRepository.delete({ _id: id });
        res
            .status(200)
            .json({ message: "post deleted successfully ", success: true });
    };
}
exports.default = new PostService();
