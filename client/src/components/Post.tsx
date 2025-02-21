import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Separator
} from "@/components/ui";
import {commentDef, postDef} from "@/constants/types/post.ts";
import {
    ContactRound,
    Ellipsis,
    EyeOff,
    Heart,
    MessageCircle,
    PencilLine,
    SquareArrowOutUpRight,
    Trash2,
    UserRoundPlus
} from 'lucide-react'
import {SendInput, Swiper} from "@/components/index.ts";
import axios from 'axios'
import {useEffect, useState} from 'react'
import {FRIEND_URL, POST_URL} from "@/constants/api";
import {timeSince} from "@/utils/convert";
import {t} from "i18next";
import Modal from "@/components/Modal";
import CommentSection from "@/components/CommentSection";
import {userDataDef} from "@/constants/types/auth";
import {useToast} from "@/hooks/use-toast";
import {useDispatch} from "react-redux";
import {POST_MODAL_ACTION, setEditPost} from "@/redux/reducers/editPostReducer";
import {useNavigate} from "react-router";

type postProps = {
    data: postDef,
    userData: userDataDef,
    onRemovePost: (postId: string) => void,
}

const Post = (props: postProps) => {

    const { data, userData, onRemovePost } = props
    const [likeQuantity, setLikeQuantity]  = useState<number>(data?.likes)
    const [commentQuantity, setCommentQuantity] = useState<number>(data?.comments)
    const [shareQuantity, setShareQuantity] = useState<number>(data?.shares)
    const [isLike, setIsLike] = useState<boolean>(data?.isLiked)
    const [isShare, setIsShare] = useState<boolean>(data?.isShared)
    const [commentModal, setCommentModal] = useState<boolean>(false)
    const [commentData, setCommentData] = useState<commentDef[]>([])
    const [commentCursor, setCommentCursor] = useState<string>('')
    const [replyContent, setReplyContent] = useState<string>('')

    const { toast } = useToast()
    const dispatch = useDispatch()
    const navigate = useNavigate();

    useEffect(() => {
        if(!commentModal){
            setCommentData([])
        }
    }, [commentModal])

    const handleOpenCommentModal = () => {
        if(!commentModal){
            axios.get(POST_URL.GET_COMMENTS_BY_POST_ID_URL + `/${data?._id}`, {
                params: {
                    cursor: commentCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200){
                    setCommentCursor(res.data?.nextCursor ?? "");
                    const newCommentData: commentDef[] = [...commentData, ...res.data.processedComments];
                    setCommentData(newCommentData)
                    setCommentModal(true)
                }
            })
        }else {
            setCommentCursor("")
            setCommentData([])
            setCommentModal(false)
        }
    }

    const handleLike = () => {
        axios.post(POST_URL.LIKE_POST_URL, {
            postId: data?._id,
            isLike: !isLike
        }).then(res => {
            if(res.status == 200){
                if(isLike){
                    setIsLike(false)
                    setLikeQuantity(likeQuantity - 1)
                }else{
                    setIsLike(true)
                    setLikeQuantity(likeQuantity + 1)
                }
            }
        })
    }

    const handleShare = () => {
        axios.post(POST_URL.SHARE_POST_URL, {
            postId: data?._id
        }).then(res => {
            if(res.status == 200){
                if(!isShare){
                    setIsShare(true)
                    setShareQuantity(shareQuantity + 1)
                    toast({
                        title: t("toast:share_post_success"),
                    })
                }
            }else{
                toast({
                    title: t("toast:share_post_fail"),
                })
            }
        })
    }

    const handleCommentPost = () => {
        axios.post(POST_URL.COMMENT_POST_URL, {
            postId: data?._id,
            content: replyContent
        }).then(res => {
            if(res.status == 200){
                setCommentData([res.data, ...commentData])
                setCommentQuantity(commentQuantity + 1)
                setReplyContent("")
            }
        })
    }

    const handleMakeFriend = () => {
        axios.post(FRIEND_URL.SEND_FRIEND_REQUEST, {
            friendId: data?.createdBy._id
        }).then(res => {
            if(res.status === 200){
                toast({
                    title: t("toast:send_friend_req_success"),
                })
            }else{
                toast({
                    title: t("toast:send_friend_req_fail"),
                })
            }
        })
    }

    const handleArchivePost = () => {
        axios.post(POST_URL.ARCHIVE_POST_URL, {
            postId: data?._id
        }).then(res => {
            if(res.status === 200){
                onRemovePost(data?._id)
                toast({
                    title: t("toast:hide_post_success"),
                })
            }else{
                toast({
                    title: t("toast:hide_post_success"),
                })
            }
        })
    }

    const handleDeletePost = () => {
        axios.delete(POST_URL.DELETE_POST_URL + `/${data?._id}`).then(res => {
            if(res.status === 200){
                onRemovePost(data?._id)
                toast({
                    title: t("toast:delete_post_success"),
                })
            }else{
                toast({
                    title: t("toast:delete_post_success"),
                })
            }
        })
    }

    const handleEditPost = () => {
        dispatch(setEditPost({
            open: true,
            editPostData: data,
            action: POST_MODAL_ACTION.EDIT
        }))
    }

    return (
        <div className='flex-col w-full rounded-xl px-4 flex items-center mb-3 bg-[#181818] text-white'>
            <div className=' w-full h-[72px] flex justify-between items-center'>
                <div className='flex items-center'>
                    <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger>
                            <Avatar className='cursor-pointer'>
                                <AvatarImage className='bg-white' src={data?.createdBy.avatar} alt='avatar'/>
                                <AvatarFallback delayMs={600}>?</AvatarFallback>
                            </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className='flex flex-col bg-[#181818] text-white w-[300px]' sideOffset={12}>
                            <div className='flex mb-4 gap-x-3'>
                                <Avatar className='cursor-pointer w-16 h-16'>
                                    <AvatarImage className='bg-white' src={data?.createdBy.avatar} alt='avatar'/>
                                    <AvatarFallback delayMs={600}>?</AvatarFallback>
                                </Avatar>
                                <p className='text-2xl font-bold flex-1'>{data?.createdBy.displayName}</p>
                            </div>
                            <div className='flex gap-x-3 text-base'>
                                <button className='flex flex-1 gap-x-3 justify-center items-center bg-blue-500 rounded-lg p-2' type='button' onClick={() => navigate(`/profile/${data.createdBy._id}`)}>
                                    <ContactRound size={24} color='#ffffff'/>
                                    {t("button:profile")}
                                </button>
                                {data?.createdBy?._id != userData?._id && <button className='flex gap-x-3 items-center bg-blue-500 rounded-lg p-2' type='button' onClick={handleMakeFriend}>
                                    <UserRoundPlus size={24} color='#ffffff'/>
                                </button>}
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div className='flex flex-col justify-around ml-3'>
                        <p className='text-lg font-medium'>{data?.createdBy.displayName}</p>
                        <p className='text-sm text-gray-400'>{timeSince(data?.createdAt) + ` ${t("label:ago").toLowerCase()}`}</p>
                    </div>
                </div>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                        <button type='button'
                                className='p-2 my-2 cursor-pointer rounded-full transition hover:bg-[rgba(255,255,255,.3)]'>
                            <Ellipsis size={24} color='#cccccc'/>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[#181818] text-white">
                        <DropdownMenuItem className='group hover:bg-gray-300 hover:text-black cursor-pointer' onClick={handleArchivePost}>
                            <EyeOff className='group-hover:text-black text-white' size={24}/>
                            <p>{t("button:hide_post")}</p>
                        </DropdownMenuItem>
                        {data?.createdBy._id == userData?._id && <DropdownMenuItem className='group hover:bg-gray-300 hover:text-black cursor-pointer' onClick={handleEditPost}>
                            <PencilLine className='group-hover:text-black text-white' size={24}/>
                            <p>{t("button:edit_post")}</p>
                        </DropdownMenuItem>}
                        {data?.createdBy._id == userData?._id && <DropdownMenuItem className='group hover:bg-gray-300 hover:text-black cursor-pointer' onClick={handleDeletePost}>
                            <Trash2 size={24} color='red'/>
                            <p>{t("button:delete_post")}</p>
                        </DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p className='w-full flex-1 bg-transparent font-medium text-lg'>{data?.content}</p>
            <Swiper mediaList={data?.media} isEditable={false}/>
            <div className='flex w-full'>
                <button type='button' onClick={handleLike}
                        className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                    <Heart size={24} color={isLike ? 'red' : 'white'}/>
                    <p className='ml-2'>{likeQuantity}</p>
                </button>
                <button type='button' onClick={handleOpenCommentModal}
                        className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                    <MessageCircle size={24} color='#ffffff'/>
                    <p className='ml-2'>{commentQuantity}</p>
                </button>
                <button type='button' onClick={handleShare} disabled={data?.createdBy._id == userData?._id}
                        className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                    <SquareArrowOutUpRight size={24} color={isShare ? 'red' : 'white'}/>
                    <p className='ml-2'>{shareQuantity}</p>
                </button>
            </div>
            <Modal open={commentModal} onClose={() => setCommentModal(false)} width={640} height={640}
                   title={t("title:post_of", {username: data?.createdBy.displayName})}
                   style={{backgroundColor: "#181818", color: '#ffffff'}} renderBottom={() => <SendInput avatar={userData?.avatar} placeholder={t("placeholder:answer_x", {username: data?.createdBy.displayName})} value={replyContent} onChange={(value) => setReplyContent(value)} onSend={handleCommentPost}/>}>
                <div className=' w-full h-[72px] flex justify-between items-center'>
                    <div className='flex items-center'>
                        <Avatar className='cursor-pointer'>
                            <AvatarImage className='bg-white' src={data?.createdBy.avatar} alt='avatar'/>
                            <AvatarFallback delayMs={600}>?</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col justify-around ml-3'>
                            <p className='text-lg font-medium'>{data?.createdBy.displayName}</p>
                            <p className='text-sm text-gray-400'>{timeSince(data?.createdAt) + ` ${t("label:ago").toLowerCase()}`}</p>
                        </div>
                    </div>
                </div>
                <p className='w-full bg-transparent font-medium text-lg'>{data?.content}</p>
                <Swiper mediaList={data?.media} isEditable={false}/>
                <div className='flex w-full'>
                    <button type='button' onClick={handleLike}
                            className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                        <Heart size={24} color={isLike ? 'red' : 'white'}/>
                        <p className='ml-2'>{likeQuantity}</p>
                    </button>
                    <button type='button' onClick={handleOpenCommentModal}
                            className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                        <MessageCircle size={24} color='#ffffff'/>
                        <p className='ml-2'>{data?.comments}</p>
                    </button>
                    <button type='button' onClick={handleShare}
                            className='flex p-2 my-2 mr-3 cursor-pointer rounded-xl transition hover:bg-[rgba(255,255,255,.3)]'>
                        <SquareArrowOutUpRight size={24} color={isShare ? 'red' : 'white'}/>
                        <p className='ml-2'>{data?.shares}</p>
                    </button>
                </div>
                {commentData?.length > 0 && <Separator />}
                <CommentSection avatar={{avatar: userData?.avatar, displayName: userData?.displayName}}
                                commentList={commentData}/>
            </Modal>
        </div>
    )
}

export default Post;