import {useState} from 'react';
import {commentDef, commentSectionProps} from "@/constants/types/post.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {timeSince} from "@/utils/convert.ts";
import {CornerDownRight} from "lucide-react";
import {t} from "i18next";
import {POST_URL} from "@/constants/api";
import axios from "axios";
import {SendInput} from "@/components/index";

type singleCommentProps = {
    commentData: commentDef;
    isReplyComment?: boolean;
    userAvatar: {
        avatar: string;
        displayName: string;
    };
    isLast?: boolean;
    replyCommentId?: string;
    onReplyComment?: (comment: commentDef) => void;
}

const SingleComment = (props: singleCommentProps) => {

    const {
        commentData: {createdBy, createdAt, content, replies, _id},
        isReplyComment = false,
        userAvatar,
        isLast = false,
        replyCommentId,
        onReplyComment
    } = props

    const [isShowReply, setIsShowReply] = useState<boolean>(false)
    const [replyContent, setReplyContent] = useState<string>('')
    const [replyCursor, setReplyCursor] = useState<string>('')
    const [replyList, setReplyList] = useState<commentDef[]>([])

    const handleOpenReply = () => {
        axios.get(POST_URL.GET_REPLY_COMMENTS_URL + `/${_id}`, {
            params: {
                cursor: replyCursor,
                limit: 10,
            }
        }).then(res => {
            if (res.status == 200) {
                setReplyList(res.data.replies)
                setReplyCursor(res.data.nextCursor)
            }
            setIsShowReply(true)
        }).catch(() => {
            setIsShowReply(true)
        })

    }

    const handleReply = () => {
        axios.post(POST_URL.REPLY_COMMENTS_URL, {
            commentId: replyCommentId ?? _id,
            content: replyContent
        }).then(res => {
            if (res.status == 200) {
                setReplyList([...replyList, res.data])
                setReplyContent("")
                if (onReplyComment) {
                    onReplyComment(res.data)
                }
            }
        })
    }

    return <div className='flex flex-col w-full mt-3'>
        <div className='flex'>
            <Avatar className='cursor-pointer mr-3'>
                <AvatarImage className='bg-white' src={createdBy.avatar} alt='avatar'/>
                <AvatarFallback delayMs={600}>?</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-col'>
                <div className='w-fit py-1 px-3 rounded-2xl bg-[#333333]'>
                    <p className='font-bold mr-3'>{createdBy.displayName}</p>
                    <p>{content}</p>
                </div>
                <div className='flex mt-1'>
                    <p className='text-sm text-gray-400 mr-3 select-none first-letter:uppercase'>{timeSince(createdAt) + ` ${t("label:ago").toLowerCase()}`}</p>
                    {!isReplyComment && <p className='text-sm text-gray-400 cursor-pointer hover:underline'
                                           onClick={() => setIsShowReply(!isShowReply)}>{isShowReply ? t("button:collapse") : t("button:response")}</p>}
                </div>
                {(replies != undefined && replies > 0 && !isShowReply) &&
                    <div className='flex mt-1 items-center cursor-pointer' onClick={handleOpenReply}>
                        <CornerDownRight className='mr-1' color='#ffffff' size={18}/>
                        <p>{t("label:show_x_comments", {x: replies})}</p>
                    </div>}
                {isShowReply && (replyList.length > 0 ? (replyList?.map((item, index) => <SingleComment key={index}
                                                                                                        userAvatar={userAvatar}
                                                                                                        isReplyComment
                                                                                                        commentData={item}
                                                                                                        isLast={index == replyList.length - 1}
                                                                                                        replyCommentId={_id}
                                                                                                        onReplyComment={(comment) => setReplyList([...replyList, comment])}/>)) : (
                    <SendInput avatar={userAvatar.avatar}
                               placeholder={t("placeholder:answer_x", {username: userAvatar.displayName})}
                               value={replyContent} onChange={(value) => setReplyContent(value)}
                               onSend={handleReply}/>))}
            </div>
            {/*<Ellipsis size={24} color='#ffffff'/>*/}
        </div>
        {(isReplyComment && isLast) && <SendInput avatar={userAvatar.avatar}
                                                  placeholder={t("placeholder:answer_x", {username: userAvatar.displayName})}
                                                  value={replyContent} onChange={(value) => setReplyContent(value)}
                                                  onSend={handleReply}/>}
    </div>
}

const CommentSection = (props: commentSectionProps) => {

    const {commentList, avatar} = props

    return <div className='w-full pt-4'>
        {commentList.map((item, index) => <SingleComment key={index} userAvatar={avatar} commentData={item}/>)}
    </div>
}

export default CommentSection;