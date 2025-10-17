"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequestRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const friend_request_model_1 = require("./friend-request.model");
class FriendRequestRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(friend_request_model_1.FriendRequest);
    }
}
exports.FriendRequestRepository = FriendRequestRepository;
