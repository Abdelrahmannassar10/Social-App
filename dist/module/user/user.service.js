"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const friend_request_repository_1 = require("../../DB/model/friend-request/friend-request.repository");
class userService {
    userRepository = new DB_1.UserRepository();
    friendRequestRepository = new friend_request_repository_1.FriendRequestRepository();
    constructor() { }
    getProfile = async (req, res, next) => {
        let user = await this.userRepository.getOne({ _id: req.user._id });
        return res
            .status(200)
            .json({ message: "done", success: true, data: { user } });
    };
    addFriend = async (req, res, next) => {
        const { friendEmail } = req.body;
        const userExist = await this.userRepository.getOne({ email: friendEmail });
        console.log(userExist, req.user);
        if (!userExist)
            throw new utils_1.NotFoundException("user not founded");
        await this.friendRequestRepository.create({
            sender: req.user._id,
            receiver: userExist.id,
        });
        res.sendStatus(200);
    };
    showRequest = async (req, res, next) => {
        const friends = await this.friendRequestRepository.getMany({ receiver: req.user._id }, {}, { populate: [{ path: "sender" }] });
        console.log(req.user);
        res
            .status(200)
            .json({ message: "friends", success: true, data: { friends } });
    };
    acceptRequest = async (req, res, next) => {
        const { friendEmail } = req.body;
        const user = await this.userRepository.getOne({ email: friendEmail });
        if (!user)
            throw new utils_1.NotFoundException("user not founded");
        const friendExist = await this.friendRequestRepository.getOne({
            sender: user.id,
            receiver: req.user._id,
        });
        if (!friendExist)
            throw new utils_1.NotFoundException("friend not founded ");
        //add to sender
        await this.userRepository.update({ _id: req.user._id }, { $push: { friends: user.id } });
        //add to receiver
        await this.userRepository.update({ _id: user.id }, { $push: { friends: req.user.id } });
        // delete request
        await this.friendRequestRepository.delete({
            receiver: req.user.id,
            sender: user._id,
        });
        res.status(200).json({ message: "friend add successfully", success: true });
    };
    blockUser = async (req, res, next) => {
        const { userEmail } = req.body;
        const userExist = await this.userRepository.getOne({ email: userEmail });
        if (!userExist)
            throw new utils_1.NotFoundException("user is not founded");
        if (userExist._id.toString() == req.user._id.toString())
            throw new utils_1.UnAuthorizedException("you can not block your self");
        if (req.user.blockedUsers.includes(userExist._id))
            throw new utils_1.UnAuthorizedException("user is already blocked");
        await this.userRepository.update({ _id: req.user._id }, { $push: { blockedUsers: userExist._id } });
        res
            .status(200)
            .json({ message: "user blocked successfully", success: true });
    };
    deleteFriendRequest = async (req, res) => {
        const { id } = req.params;
        const userExist = await this.userRepository.getOne({
            $or: [
                { sender: req.user._id, receiver: id },
                { sender: id, receiver: req.user._id },
            ],
        });
        if (!userExist)
            throw new utils_1.NotFoundException("user not found ");
        const friendRequest = await this.friendRequestRepository.getOne({
            receiver: id,
            sender: req.user._id,
        });
        if (!friendRequest)
            throw new utils_1.NotFoundException("friend request not found ");
        await this.friendRequestRepository.delete({
            receiver: id,
            sender: req.user._id,
        });
        res
            .status(200)
            .json({ message: "request is deleted successfully", success: true });
    };
    unfriend = async (req, res) => {
        const { id } = req.params;
        const friendExist = await this.userRepository.exist({ friends: id });
        if (!friendExist)
            throw new utils_1.NotFoundException("friend not founded");
        await this.userRepository.update({ _id: req.user._id }, { $pull: { friends: id } });
        await this.userRepository.update({ _id: id }, { $pull: { friends: req.user._id } });
        return res.status(200).json({
            message: "Friend removed successfully",
            success: true,
        });
    };
}
exports.default = new userService();
