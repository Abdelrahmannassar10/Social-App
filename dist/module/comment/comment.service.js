"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
const react_provider_1 = require("../../utils/common/providers/react.provider");
class CommentService {
    postRepository = new DB_1.PostRepository();
    commentRepository = new DB_1.CommentRepository();
    commentFactoryService = new factory_1.CommentFactoryService();
    createComment = async (req, res) => {
        const { postId, id } = req.params;
        const commentDTO = req.body;
        const postExist = await this.postRepository.exist({ _id: postId });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        let commentExist = undefined;
        if (id) {
            commentExist = await this.commentRepository.exist({ _id: id });
            if (!commentExist) {
                throw new utils_1.NotFoundException("comment not founded");
            }
        }
        const comment = this.commentFactoryService.create(commentDTO, req.user, postExist, commentExist);
        const createdComment = await this.commentRepository.create(comment);
        res
            .status(200)
            .json({ message: "done", success: true, data: { createdComment } });
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const commentExist = await this.commentRepository.getOne({ _id: id }, {}, {
            populate: [{ path: "replies" }],
        });
        if (!commentExist) {
            throw new utils_1.NotFoundException("comment not founded");
        }
        res
            .status(200)
            .json({ message: "done", success: true, data: { commentExist } });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const commentExist = await this.commentRepository.getOne({ _id: id }, {}, {
            populate: [{ path: "postId", select: "userId" }],
        });
        if (!commentExist) {
            throw new utils_1.NotFoundException("comment not founded");
        }
        if ([
            commentExist.userId.toString(),
            commentExist.postId.userId.toString(),
        ].includes(req.user._id.toString())) {
            throw new utils_1.UnAuthorizedException("you are not authorized to delete this comment");
        }
        await this.commentRepository.delete({ _id: id });
        res
            .status(200)
            .json({ message: "comment deleted successfully", success: true });
    };
    addReaction = async (req, res) => {
        const { id } = req.params;
        const AddReactionDTO = req.body;
        const userId = req.user.id;
        await (0, react_provider_1.addReactionProvider)(this.commentRepository, id, userId, AddReactionDTO.reaction);
        res.sendStatus(204);
    };
}
exports.CommentService = CommentService;
exports.default = new CommentService();
