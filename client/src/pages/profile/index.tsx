import {MainLayout} from "@/pages";
import {t} from "i18next";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {ContactList, EditProfileModal, Post} from "@/components";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {useEffect, useRef, useState} from "react";
import {postDef} from "@/constants/types/post.ts";
import axios from "axios";
import {POST_URL} from "@/constants/api.ts";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {clearEditPost, POST_MODAL_ACTION} from "@/redux/reducers/editPostReducer.ts";
import {Cake} from "lucide-react";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import 'dayjs/locale/en';

const ProfilePage = () => {

    const userData = useSelector((state: RootState) => state.auth.value.user)
    const editPost = useSelector((state: RootState) => state.editPost.value)
    const locale = useSelector((state: RootState) => state.locale.value)
    const [profileTab, setProfileTab] = useState<number>(0)
    const [postData, setPostData] = useState<postDef[]>([])
    const [postCursor, setPostCursor] = useState<string>('')
    const [shareData, setShareData] = useState<postDef[]>([])
    const [shareCursor, setShareCursor] = useState<string>('')
    const [editProfileModal, setEditProfileModal] = useState<boolean>(false)

    const postLoadingRef = useRef<HTMLDivElement>(null)
    const sharePostLoadingRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        handleLoadMyPost()
        handleLoadSharePost()
    }, [])

    useEffect(() => {
        if(editPost.editPostData){
            handleUpdateNewPost(editPost.editPostData, editPost.action)
        }
    }, [editPost]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && postCursor != '') {
                handleLoadMyPost()
            }
        }, { threshold: 1 })

        if (postLoadingRef.current) {
            observer.observe(postLoadingRef.current);
        }

        return () => observer.disconnect()
    }, [postData, postCursor]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && shareCursor != '') {
                handleLoadMyPost()
            }
        }, { threshold: 1 })

        if (sharePostLoadingRef.current) {
            observer.observe(sharePostLoadingRef.current);
        }

        return () => observer.disconnect()
    }, [shareData, shareCursor]);

    const handleLoadMyPost = () => {
        if(postCursor != null){
            postLoadingRef!.current!.style.opacity = '1'
            axios.get(POST_URL.GET_MY_POSTS_URL, {
                params: {
                    cursor: postCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200) {
                    setPostData([...postData, ...res.data.posts])
                    setPostCursor(res.data.nextCursor)
                }
                postLoadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleLoadSharePost = () => {
        if(shareCursor != null){
            sharePostLoadingRef!.current!.style.opacity = '1'
            axios.get(POST_URL.GET_MY_SHARE_POST_URL, {
                params: {
                    cursor: shareCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200) {
                    setShareData([...shareData, ...res.data.posts])
                    setShareCursor(res.data.nextCursor)
                }
                sharePostLoadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleRemovePost = (postId: string) => {
        setPostData(postData.filter(post => post._id!== postId))
    }

    const handleUpdateNewPost = (postData: postDef, action?: POST_MODAL_ACTION) => {
        setPostData((prevPosts) => {
            let updatedPosts = prevPosts;
            if (action == POST_MODAL_ACTION.EDIT) {
                updatedPosts = prevPosts.filter(post => post._id !== postData._id);
            }
            return [postData, ...updatedPosts];
        });
        dispatch(clearEditPost())
    }

    return <MainLayout>
        <div className='h-full flex flex-1 justify-center text-white'>
            <div className='min-w-[640px] w-[80%] my-6'>
                <div className='w-full h-full rounded-xl flex flex-col items-center mb-3 bg-[#181818] overflow-y-scroll no-scrollbar'>
                    <div className='flex w-full p-6'>
                        <div className='flex flex-1 flex-col justify-center'>
                            <p className='font-bold text-3xl'>{userData?.username}</p>
                            <p className='text-xl'>{userData?.displayName}</p>
                            <div className='flex items-center my-1'>
                                <Cake size={24} color='#ffffff'/>
                                <p style={{ lineHeight: 'initial' }} className='ml-3 text-base'>{dayjs(userData?.dob).locale(locale).format('DD/MM/YYYY')}</p>
                            </div>
                        </div>
                        <Avatar className='cursor-pointer h-32 w-32'>
                            <AvatarImage className='bg-white' src={userData?.avatar} alt='avatar'/>
                            <AvatarFallback delayMs={600}>?</AvatarFallback>
                        </Avatar>
                    </div>
                    {userData?.bio && <p className='w-full p-6'>{userData?.bio}</p>}
                    <button type='button' className='mx-4 rounded-lg border-white border p-2 w-[92%] my-4' onClick={() => setEditProfileModal(true)}>{t("button:edit")}</button>
                    <div className='flex w-full mt-2'>
                        <button className='flex flex-1 justify-center items-center text-lg font-medium py-2' type='button' style={{ color: profileTab == 0 ? '#ffffff' : '#777777', borderBottom: profileTab == 0 ? '2px solid #ffffff' : undefined }} onClick={() => setProfileTab(0)}>
                            {t("button:my_post")}
                        </button>
                        <button className='flex flex-1 justify-center items-center text-lg font-medium py-2' type='button' style={{ color: profileTab == 1 ? '#ffffff' : '#777777', borderBottom: profileTab == 1 ? '2px solid #ffffff' : undefined }} onClick={() => setProfileTab(1)}>
                            {t("button:repost")}
                        </button>
                    </div>
                    <div className='border-b border-gray-400 w-full'/>
                    <div className='w-full' style={{ display: profileTab == 0 ? 'block' : 'none' }}>
                        {postData?.map((post, index) => <div key={index} className='w-full' style={{borderBottom: index != postData.length - 1 ? '1px solid white' : undefined}}>
                            <Post data={post} userData={userData!} onRemovePost={handleRemovePost} />
                        </div>)}
                        <div className='w-full h-10 flex justify-center items-center' ref={postLoadingRef}>
                            <div className='h-10 w-10'>
                                <Lottie animationData={LoadingAnimation}/>
                            </div>
                        </div>
                    </div>
                    <div className='w-full' style={{ display: profileTab == 1 ? 'block' : 'none' }}>
                        {shareData?.map((post, index) => <div key={index} className='w-full' style={{borderBottom: index != shareData.length - 1 ? '1px solid white' : undefined}}>
                            <Post data={post} userData={userData!} onRemovePost={handleRemovePost} />
                        </div>)}
                        <div className='w-full h-10 flex justify-center items-center' ref={sharePostLoadingRef}>
                            <div className='h-10 w-10'>
                                <Lottie animationData={LoadingAnimation}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ContactList/>
        <EditProfileModal open={editProfileModal} onClose={() => setEditProfileModal(false)}/>
    </MainLayout>
}

export default ProfilePage;