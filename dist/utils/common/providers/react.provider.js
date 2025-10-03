"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionProvider = void 0;
const error_1 = require("../../error");
const addReactionProvider = async (repo, id, userId, reaction) => {
    const postExist = await repo.exist({ _id: id });
    if (!postExist) {
        throw new error_1.NotFoundException("post not founded");
    }
    let userReactionIndex = postExist.reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId.toString();
    });
    if (userReactionIndex == -1) {
        await repo.update({ _id: id }, {
            $push: {
                reactions: { reaction, userId },
            },
        });
    }
    else if ([null, undefined, ""].includes(reaction)) {
        await repo.update({
            _id: id,
        }, {
            $pull: {
                reactions: postExist.reactions[userReactionIndex],
            },
        });
    }
    else {
        await repo.update({ _id: id, "reactions.userId": userId }, {
            "reactions.$.reaction": reaction,
        });
    }
};
exports.addReactionProvider = addReactionProvider;
