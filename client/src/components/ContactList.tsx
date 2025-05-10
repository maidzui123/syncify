import {t} from "i18next";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {useEffect, useRef, useState} from "react";
import {userDataDef} from "@/constants/types/auth";
import useSocket, { socket } from "@/hooks/useSocket";
import axios from "axios";
import {FRIEND_URL} from "@/constants/api";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

const ContactList = () => {

    const [friends, setFriends] = useState<userDataDef[]>([])
    const [friendCursor, setFriendCursor] = useState<string>('')
    const locale = useSelector((state:RootState) => state.locale.value)

    const chatloadingRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    useSocket()

    useEffect(() => {
        initSocket()
        handleGetListFriends()
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && friendCursor != '') {
                handleGetListFriends()
            }
        }, {threshold: 1})

        if (chatloadingRef.current) {
            observer.observe(chatloadingRef.current);
        }

        return () => observer.disconnect()
    }, [friends, friendCursor]);

    const initSocket = () => {
        if (socket) {
            socket.on('userOnline', data => {
                console.log(data)
                setFriends((prevFriends) =>
                    prevFriends.map((friend) =>
                        friend._id === data.userId ? { ...friend, isOnline: true } : friend
                    )
                );
            })
            socket.on('userOffline', data => {
                setFriends((prevFriends) =>
                    prevFriends.map((friend) =>
                        friend._id === data.userId ? { ...friend, isOnline: false } : friend
                    )
                );
            })
        }
    }

    const handleGetListFriends = () => {
        if (friendCursor != null) {
            chatloadingRef!.current!.style.opacity = '1'
            axios.get(FRIEND_URL.GET_LIST_FIENDS_URL, {
                params: {
                    cursor: friendCursor,
                    limit: 10,
                }
            }).then(res => {
                if (res.status == 200) {
                    setFriends([...friends, ...res.data.friends])
                    setFriendCursor(res.data.nextCursor)
                }
                chatloadingRef!.current!.style.opacity = '0'
            })
        }
    }

    return <div className='w-[360px] h-full py-8 px-2 flex flex-col flex-nowrap overflow-y-auto'>
        <p className='text-md font-bold text-white select-none'>{t("title:friend_status_list")}</p>
        {friends.map((friend, index) => <div key={index}
                                             className='flex w-full px-3 my-1 cursor-pointer items-center h-12 rounded-lg hover:bg-[rgba(255,255,255,.3)]' onClick={() => navigate('/chats')}>
                <Avatar showStatus userStatus={friend.isOnline} className='cursor-pointer'>
                    <AvatarImage className='bg-white' src={friend.avatar} alt='avatar'/>
                    <AvatarFallback delayMs={600}>?</AvatarFallback>
                </Avatar>
                <p className='ml-3 text-md font-medium text-white'>{friend.displayName}</p>
            </div>
        )}
        <div className='w-full h-10 flex justify-center items-center' ref={chatloadingRef}>
            <div className='h-10 w-10'>
                <Lottie animationData={LoadingAnimation}/>
            </div>
        </div>
    </div>
}

export default ContactList