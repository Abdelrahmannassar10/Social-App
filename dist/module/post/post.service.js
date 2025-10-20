"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_1 = require("../../utils");
const react_provider_1 = require("../../utils/common/providers/react.provider");
const email_1 = require("../../utils/email");
const dev_config_1 = require("../../config/env/dev.config");
class PostService {
    postRepository = new DB_1.PostRepository();
    postFactoryService = new factory_1.PostFactoryService();
    userRepository = new DB_1.UserRepository();
    create = async (req, res) => {
        //create dto
        const createPostDTO = req.body;
        const user = await this.userRepository.getOne({ _id: req.user._id });
        //create factory , entity
        const post = this.postFactoryService.create(createPostDTO, req.user);
        //create in db
        const createdPost = await this.postRepository.create(post);
        if (createPostDTO.mentions && createPostDTO.mentions.length) {
            for (const email of createPostDTO.mentions) {
                await (0, email_1.sendMail)({
                    to: email,
                    subject: "You were mentioned in a post",
                    html: dev_config_1.devConfig.MENTIONS_BODY(user.firstName, createPostDTO.content),
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
    addReaction = async (req, res) => {
        const { id } = req.params;
        const addReactionDTO = req.body;
        const userId = req.user._id.toString();
        await (0, react_provider_1.addReactionProvider)(this.postRepository, id, userId, addReactionDTO.reaction);
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
        if (post.deletedAt) {
            throw new utils_1.BadRequestException("post has been deleted");
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
    freezePost = async (req, res) => {
        const { id } = req.params;
        const postExist = await this.postRepository.exist({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        if (postExist.userId.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not authorized to delete the post");
        }
        await this.postRepository.update({ _id: id }, { $set: { deletedAt: new Date() } });
        res
            .status(200)
            .json({ message: "post has been soft deleted", success: true });
    };
    unfreezePost = async (req, res) => {
        const { id } = req.params;
        const postExist = await this.postRepository.exist({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        if (postExist.userId.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not authorized to delete the post");
        }
        await this.postRepository.update({ _id: id }, { $set: { deletedAt: undefined } });
        res.status(200).json({ message: "post has been retrieved", success: true });
    };
    updatePost = async (req, res) => {
        const { id } = req.params;
        const updatePostDTO = req.body;
        const postExist = await this.postRepository.getOne({ _id: id });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        if (postExist.userId.toString() != req.user._id.toString()) {
            throw new utils_1.UnAuthorizedException("you are not authorized to update the post");
        }
        const post = this.postFactoryService.update(updatePostDTO);
        await this.postRepository.update({ _id: postExist._id }, { $set: { content: post.content, mentions: post.mentions } });
        res.status(200).json({ message: "post updated successfully", success: true });
    };
}
exports.default = new PostService();
