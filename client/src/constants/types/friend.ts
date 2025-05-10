import {userDataDef} from "@/constants/types/auth";

export type friendDef = {
    toUserId: string;
    _id: string;
    fromUserId: userDataDef;
    mutualFriends: number;
}