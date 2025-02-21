export const BASE_URL = 'http://localhost:3000';
export const SOCKET_URL = 'ws://localhost:3000';

export const AUTH_URL = {
    REGISTER_URL: '/api/register',
    LOGIN_URL: '/api/login',
    REFRESH_URL: '/api/refresh-token',
    VERIFY_OTP_URL: '/api/code/verify',
    RESENT_OTP_URL: '/api/code/resend',
    LOGIN_GOOGLE_URL: '/api/google/login',
    SEND_OTP_FOR_RESET_PASS_URL: '/api/code/send',
    RESET_PASSWORD_URL: '/api/reset-password',
    CHANGE_PASSWORD_URL: '/api/change-password'
}

export const PROFILE_URL = {
    UPDATE_PROFILE_URL: '/api/user',
    GET_PROFILE_URL: '/api/users/profile/me',
    GET_OTHER_PROFILE_URL: '/api/users/profile'
}

export const MEDIA_URL = {
    UPDATE_MEDIA_URL: '/api/upload'
}

export const POST_URL = {
    CREATE_POST_URL: '/api/posts',
    GET_MY_POSTS_URL: '/api/posts/me',
    GET_POST_URL: '/api/posts',
    LIKE_POST_URL: '/api/posts/interact',
    GET_COMMENTS_BY_POST_ID_URL: '/api/posts/comments',
    GET_REPLY_COMMENTS_URL: '/api/posts/replies',
    REPLY_COMMENTS_URL: '/api/posts/reply',
    COMMENT_POST_URL: '/api/posts/comment',
    SHARE_POST_URL: '/api/posts/share',
    ARCHIVE_POST_URL: '/api/posts/archive',
    DELETE_POST_URL: '/api/posts',
    EDIT_POST_URL: '/api/posts',
    GET_MY_SHARE_POST_URL: '/api/posts/sharing/me',
    GET_OTHER_SHARE_POST_URL: '/api/posts/sharing',
    GET_OTHER_POST_URL: '/api/posts'
}

export const CHAT_URL = {
    CHAT_URL: '/api/chats',
    CHAT_MESSAGE_URL: '/api/messages'
}

export const NOTIFICATION_URL = {
    GET_ALL_NOTIFICATIONS_URL: '/api/notifications',
    MARK_AS_READ_URL: '/api/notifications/mark-read'
}

export const FRIEND_URL = {
    GET_FRIEND_REQUEST: "/api/users/fr-request",
    GET_LIST_FIENDS_URL: '/api/users/friends',
    ACCEPT_FRIEND_URL: '/api/users/friends/request/accept',
    REJECT_FRIEND_URL: '/api/users/friends/request/reject',
    // SEARCH_FRIEND_URL: '/api/users/search',
    UNFRIEND_URL: '/api/users/unfriend',
    SEND_FRIEND_REQUEST: '/api/users/friends/request',
    SEARCH_USER_URL: '/api/users/search'
}