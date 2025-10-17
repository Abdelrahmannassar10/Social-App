"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRequest = void 0;
const mongoose_1 = require("mongoose");
const friend_request_schema_1 = require("./friend-request.schema");
exports.FriendRequest = (0, mongoose_1.model)("FriendRequest", friend_request_schema_1.friendRequestSchema);
