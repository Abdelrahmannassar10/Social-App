"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class CommentService {
    postRepository = new DB_1.PostRepository;
    commentRepository = new DB_1.CommentRepository;
    commentFactoryService = new factory_1.CommentFactoryService();
    createComment = async (req, res) => {
        const { postId, id } = req.params;
        const commentDTO = req.body;
        const postExist = await this.postRepository.exist({ _id: postId });
        if (!postExist) {
            throw new utils_1.NotFoundException("post not founded");
        }
        ;
        let commentExist = undefined;
        if (id) {
            commentExist = await this.commentRepository.exist({ _id: id });
            if (!commentExist) {
                throw new utils_1.NotFoundException("comment not founded");
            }
            ;
        }
        const comment = this.commentFactoryService.create(commentDTO, req.user, postExist, commentExist);
        const createdComment = await this.commentRepository.create(comment);
        res.status(200).json({ message: "done", success: true, data: { createdComment } });
    };
}
exports.CommentService = CommentService;
;
exports.default = new CommentService();
