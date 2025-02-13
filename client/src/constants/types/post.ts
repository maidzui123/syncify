export type postDef = {
    comments: number;
    content: string;
    createdAt: string;
    createdBy: {
        avatar: string;
        displayName: string;
        _id?: string;
    };
    isArchived: boolean;
    isDelete: boolean;
    likes: number;
    media: mediaDef[];
    privacy: 'public' | 'private';
    shares: number;
    updateAt: string;
    isLiked: boolean;
    isShared: boolean;
    _id: string;
}

export type mediaDef = {
    type: 'image' | 'video' | 'audio';
    url: string;
}

export type commentSectionProps = {
    commentList: commentDef[];
    avatar: {
        avatar: string;
        displayName: string;
        _id?: string;
    };
}

export type commentDef = {
    _id: string;
    createdBy: {
        avatar: string;
        displayName: string;
        _id?: string;
    };
    createdAt: string;
    replies?: number;
    content: string;
}