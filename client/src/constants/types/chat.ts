import {userDataDef} from "@/constants/types/auth";

export type chatDef = {
    chatId: string;
    lastMessage: lastMessageDef;
    otherParticipant: userDataDef
}

export type lastMessageDef = {
    content: string;
    createdAt: string;
    senderId: string;
}

export type messageDef = {
    content: string;
    chatId: string[];
    createdAt: string;
    senderId: {
        avatar: string;
        displayName: string;
        _id?: string;
    };
    isSender: boolean;
    receiverId: string;
    type: 'text';
    updatedAt: string;
    _id: string;
}