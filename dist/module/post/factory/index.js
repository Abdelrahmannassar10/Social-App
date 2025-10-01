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
        return newPost;
    }
    update() {
    }
}
exports.PostFactoryService = PostFactoryService;
