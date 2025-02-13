export type notiDef = {
    createdAt: string;
    isRead: boolean;
    payload: string;
    type: string;
    _id: string;
}

export type targetUserDef = {
    type: 'like' | 'comment' | 'replyComment' | 'acceptFriendRequest' | 'friendRequest' | 'share' | 'adminNotification',
    userId: string;
    displayName: string;
    avatar: string;
    sendAt: string;
}