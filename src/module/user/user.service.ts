import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../../DB";
import { NotFoundException } from "../../utils";
import { FriendRequestRepository } from "../../DB/model/friend-request/friend-request.repository";
import path from "path";
import { log } from "console";

class userService {
  private userRepository = new UserRepository();
  private friendRequestRepository = new FriendRequestRepository();
  constructor() {}
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    let user = await this.userRepository.getOne({ _id: req.user._id });
    return res
      .status(200)
      .json({ message: "done", success: true, data: { user } });
  };
  addFriend = async (req: Request, res: Response, next: NextFunction) => {
    const { friendEmail } = req.body;
    const userExist = await this.userRepository.getOne({ email: friendEmail });
    console.log(userExist,req.user);
    if (!userExist) throw new NotFoundException("user not founded");
    await this.friendRequestRepository.create({
      sender: req.user._id,
      receiver: userExist.id,
    });
    res.sendStatus(200);
  };
  showRequest = async (req: Request, res: Response, next: NextFunction) => {
    const friends = await this.friendRequestRepository.getOne(
      { receiver: req.user._id },
      {},
      { populate: [{ path: "sender" }] }
    );
    console.log(req.user);
    
    res
      .status(200)
      .json({ message: "friends", success: true, data: { friends } });
  };
  acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { friendEmail } = req.body;
    const user =await this.userRepository.getOne({email:friendEmail});
    if(!user)throw new NotFoundException("user not founded");
    const friendExist =await this.friendRequestRepository.getOne({sender:user.id});
    if(!friendExist)throw new NotFoundException("friend not founded ")
    //add to sender
    await this.userRepository.update({_id:req.user._id},{$push:{friends:user.id}});
    //add to receiver
    await this.userRepository.update({_id:user.id},{$push:{friends:req.user.id}});
    // delete request
    await this.friendRequestRepository.delete({receiver:req.user.id});
    res.status(200).json({message:"friend add successfully",success:true});
  };
}
export default new userService();
