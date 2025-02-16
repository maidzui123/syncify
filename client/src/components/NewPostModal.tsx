import {t} from "i18next";
import {Avatar, AvatarFallback, AvatarImage, Button, Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui";
import {Images, Smile} from "lucide-react";
import EmojiPicker, {Theme} from "emoji-picker-react";
import {Modal, Swiper} from "@/components";
import axios from "axios";
import {MEDIA_URL, POST_URL} from "@/constants/api.ts";
import {useState, useRef, ChangeEvent, useEffect} from "react";
import type {userDataDef} from "@/constants/types/auth.ts";
import {convertBlobToFile} from "@/utils/convert.ts";
import {useToast} from "@/hooks/use-toast.ts"
import {mediaDef, postDef} from "@/constants/types/post";
import {clearEditPost, POST_MODAL_ACTION, setEditPost} from "@/redux/reducers/editPostReducer";
import {useDispatch} from "react-redux";

type newPostProps = {
    userData: userDataDef | undefined,
    open: boolean,
    initPostData?: postDef;
    action?: POST_MODAL_ACTION
}

const NewPostModal = (props: newPostProps) => {

    const {userData, open, initPostData, action = POST_MODAL_ACTION.CREATE } = props
    const {toast} = useToast()

    const [selectEmoji, setSelectEmoji] = useState<boolean>(false)
    const [postText, setPostText] = useState<string>('')
    const [mediaList, setMediaList] = useState<mediaDef[]>([])

    const mediaRef = useRef<HTMLInputElement>(null)
    const imageCountRef = useRef<number>(0)
    const videoCountRef = useRef<number>(0)
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(initPostData)
        if(open && !initPostData){
            setPostText('')
            setMediaList([])
        }else if(initPostData){
            setPostText(initPostData.content)
            setMediaList(initPostData.media)
        }
    }, [initPostData, open]);

    const handleMediaUploadAsync = async () => {
        const mediaPromiseList = []
        for (const item of mediaList) {
            const result = await fetch(item.url);
            const blob = await result.blob();
            const imageFile = convertBlobToFile(blob)
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("type", item.type)
            formData.append("folderName", 'post')
            mediaPromiseList.push(axios.post(MEDIA_URL.UPDATE_MEDIA_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }))
        }
        return mediaPromiseList
    }

    const handleUploadPost = async () => {
        const listUpload = await handleMediaUploadAsync()
        const listLinkUpload = await Promise.all(listUpload)
        const mediaLink = listLinkUpload.map((media, index) => {
            return {
                url: media.data.url,
                type: mediaList[index].type
            }
        });
        if (action == POST_MODAL_ACTION.EDIT) {
            axios.patch(POST_URL.EDIT_POST_URL + `/${initPostData!._id}`, {
                content: postText,
                media: mediaLink
            }).then(res => {
                if (res.status == 200) {
                    dispatch(setEditPost({
                        open: false,
                        editPostData: res.data,
                        action: POST_MODAL_ACTION.EDIT,
                    }))
                }
            })
        } else {
            axios.post(POST_URL.CREATE_POST_URL, {
                content: postText,
                media: mediaLink
            }).then(res => {
                if (res.status == 200) {
                    dispatch(setEditPost({
                        open: false,
                        editPostData: res.data,
                        action: POST_MODAL_ACTION.CREATE,
                    }))
                }
            })
        }
    }

    const handleAddMedia = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const mediaPromise = new Promise<mediaDef[]>((resolve) => {
                const newMediaList = JSON.parse(JSON.stringify(mediaList))
                for (const media of e.target.files!) {
                    const url = URL.createObjectURL(media)
                    const type = media.type.split("/")[0]
                    if (type == 'image' && imageCountRef.current > 5) {
                        toast({
                            title: t("error:exceed_max_limit_image_upload"),
                        })
                    } else if (type == 'video' && videoCountRef.current > 2) {
                        toast({
                            title: t("error:exceed_max_limit_video_upload"),
                        })
                    } else {
                        newMediaList.push({
                            url,
                            type,
                        })
                    }
                }
                resolve(newMediaList)
            })
            mediaPromise.then(media => {
                setMediaList(media)
            })
        }
    }

    const handleRemoveMedia = (index: number) => {
        const newMediaList = JSON.parse(JSON.stringify(mediaList))
        newMediaList.splice(index, 1)
        setMediaList(newMediaList)
    }

    return <Modal width={600} open={open} onClose={() => dispatch(clearEditPost())} showHeader title={action == POST_MODAL_ACTION.EDIT ? t("title:edit_post") : t("title:new_post")} showBottom
                  style={{backgroundColor: "#181818", color: '#ffffff'}}
                  renderBottom={() => <Button variant='outline' className='text-white bg-transparent'
                                              onClick={handleUploadPost}>{action == POST_MODAL_ACTION.EDIT ? t("button:edit") : t("button:upload")}</Button>}>
        <div className='w-full h-[72px] flex items-center'>
            <Avatar className='cursor-pointer mr-3'>
                <AvatarImage className='bg-white' src={userData?.avatar} alt='avatar'/>
                <AvatarFallback delayMs={600}>?</AvatarFallback>
            </Avatar>
            <p className='text-lg font-medium'>{userData?.displayName}</p>
        </div>
        <textarea value={postText} onChange={(e) => setPostText(e.target.value)}
                  className='w-full min-h-24 flex-1 bg-transparent font-medium text-lg focus-visible:outline-0 resize-none'
                  placeholder={t("placeholder:what_you_think", {name: userData?.displayName})} autoFocus rows={3}/>
        <Swiper isEditable mediaList={mediaList} onRemove={(index) => handleRemoveMedia(index)}/>
        <div className='w-full border rounded-xl flex items-center px-4 py-3'>
            <p className='text-md font-medium flex-1 mr-4'>{t("desc:add_to_your_post")}</p>
            <Tooltip>
                <TooltipTrigger className='rounded-full p-2 hover:bg-[rgba(255,255,255,.3)] mr-4'
                                onClick={() => mediaRef.current!.click()}>
                    <Images color='#ffffff' size={24}/>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t("tooltip:image_video")}</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger className='rounded-full p-2 hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => setSelectEmoji(!selectEmoji)}>
                    <Smile color='#ffffff' size={24}/>
                </TooltipTrigger>
                <TooltipContent className='mx-4'>
                    <p>{t("tooltip:image_video")}</p>
                </TooltipContent>
            </Tooltip>
            <EmojiPicker width={320} height={280} open={selectEmoji} searchDisabled skinTonesDisabled theme={Theme.DARK}
                         onEmojiClick={(emoji) => setPostText(val => val + emoji.emoji)}
                         className='!absolute bottom-0 right-[-360px]'/>
        </div>
        <input ref={mediaRef} type="file" multiple accept="image/*,video/*" className='hidden'
               onChange={(e) => handleAddMedia(e)}/>
    </Modal>
}

export default NewPostModal;

