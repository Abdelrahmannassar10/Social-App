"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFactoryService = void 0;
const entity_1 = require("../entity");
class PostFactoryService {
    create(createPostDTO, user) {
        const newPost = new entity_1.Post;
        newPost.userId = user._id;
        newPost.content = createPostDTO.content;
        newPost.reactions = [];
        newPost.attachment = [];
        newPost.mentions = createPostDTO.mentions ?? [];
        return newPost;
    }
    update(updatePostDTO) {
        const newPost = new entity_1.Post;
        newPost.content = updatePostDTO.content;
        newPost.mentions = updatePostDTO.mentions ?? [];
        return newPost;
    }
}
exports.PostFactoryService = PostFactoryService;
