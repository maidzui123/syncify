import {memo, useEffect, useRef, useState} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {t} from 'i18next'
import {ContactList, Post} from "@/components";
import axios from 'axios'
import {POST_URL} from "@/constants/api";
import {postDef} from "@/constants/types/post";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {MainLayout} from "@/pages";
import {clearEditPost, POST_MODAL_ACTION, setEditPost} from "@/redux/reducers/editPostReducer.ts";

const HomePage = () => {

    const [posts, setPosts] = useState<postDef[]>([])
    const [postCursor, setPostCursor] = useState<string>('')

    const userData = useSelector((state: RootState) => state.auth.value.user)
    const editPost = useSelector((state: RootState) => state.editPost.value)
    const locale = useSelector((state:RootState) => state.locale.value)

    const postLoadingRef = useRef<HTMLDivElement>(null)
    const dispatch = useDispatch()

    useEffect(() => {
        handleLoadPost()
    }, [])

    useEffect(() => {
        if(editPost.editPostData && !editPost.open){
            handleUpdateNewPost(editPost.editPostData, editPost.action)
        }
    }, [editPost]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && postCursor != '') {
                handleLoadPost()
            }
        }, { threshold: 1 })

        if (postLoadingRef.current) {
            observer.observe(postLoadingRef.current);
        }

        return () => observer.disconnect()
    }, [posts, postCursor]);

    const handleLoadPost = () => {
        if(postCursor != null){
            postLoadingRef!.current!.style.opacity = '1'
            axios.get(POST_URL.GET_POST_URL, {
                params: {
                    cursor: postCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200) {
                    setPosts([...posts, ...res.data.posts])
                    setPostCursor(res.data.nextCursor)
                }
                postLoadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleUpdateNewPost = (postData: postDef, action?: POST_MODAL_ACTION) => {
        setPosts((prevPosts) => {
            let updatedPosts = prevPosts;
            if (action == POST_MODAL_ACTION.EDIT) {
                updatedPosts = prevPosts.filter(post => post._id !== postData._id);
            }
            return [postData, ...updatedPosts];
        });
        dispatch(clearEditPost())
    }

    const handleRemovePost = (postId: string) => {
        setPosts(posts.filter(post => post._id!== postId))
    }

    const handleNewPost = () => {
        dispatch(setEditPost({
            open: true,
            editPostData: undefined,
            action: POST_MODAL_ACTION.CREATE,
        }))
    }

    return <MainLayout>
        <div className='h-full flex flex-1 justify-center'>
            <div className='min-w-[640px] w-[80%] my-6 overflow-y-auto no-scrollbar'>
                <div className='w-full h-[84px] rounded-xl px-4 flex items-center mb-3 bg-[#181818] cursor-pointer' onClick={handleNewPost}>
                    <Avatar className='cursor-pointer mr-3'>
                        <AvatarImage className='bg-white' src={userData?.avatar} alt='avatar'/>
                        <AvatarFallback delayMs={600}>?</AvatarFallback>
                    </Avatar>
                    <div className='rounded-xl px-4 h-[40px] flex flex-1 items-center text-white border'>
                        {t("placeholder:what_you_think", { name: userData?.displayName })}
                    </div>
                </div>
                {posts?.map((post, index) => <Post key={index} data={post} userData={userData!} onRemovePost={handleRemovePost}/>)}
                <div className='w-full h-10 flex justify-center items-center' ref={postLoadingRef}>
                    <div className='h-10 w-10'>
                        <Lottie animationData={LoadingAnimation}/>
                    </div>
                </div>
            </div>
        </div>
        <ContactList/>
    </MainLayout>
}

export default memo(HomePage)