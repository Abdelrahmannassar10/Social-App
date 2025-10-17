import { IFriendRequest } from "../../../utils";
import { AbstractRepository } from "../../abstract.repository";
import { FriendRequest } from "./friend-request.model";

export class FriendRequestRepository extends AbstractRepository<IFriendRequest>{
constructor(){
    super(FriendRequest);
}
}