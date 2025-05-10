import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {t} from "i18next";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {useEffect, useRef, useState} from "react";
import {CHAT_URL} from "@/constants/api";
import axios from "axios";
import {chatDef} from "@/constants/types/chat";
import {timeSince} from "@/utils/convert";
import {userDataDef} from "@/constants/types/auth";
import MessageSection from "@/components/MessageSection";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import useSocket, {socket} from "@/hooks/useSocket.ts";
import {MainLayout} from "@/pages";


const ChatPage = () => {

    const [chatCursor, setChatCursor] = useState<string>('')
    const [chats, setChats] = useState<chatDef[]>([])
    const [selectedChat, setSelectedChat] = useState<userDataDef & { chatId: string }>()

    const userData = useSelector((state: RootState) => state.auth.value.user)
    const locale = useSelector((state:RootState) => state.locale.value)
    const chatScrollRef = useRef<HTMLDivElement>(null)

    useSocket()

    useEffect(() => {
        initSocket()
        handleGetListChats()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && chatCursor != null) {
                handleGetListChats()
            }
        }, {threshold: 1})

        if (chatScrollRef.current) {
            observer.observe(chatScrollRef.current);
        }

        return () => observer.disconnect()
    }, [chats, chatScrollRef]);

    const initSocket = () => {
        if (socket) {
            socket.on("chatMessage", data => {
                setChats(prevState => prevState.map(chat => chat.chatId == data.chatData.chatId ? data.chatData : chat))
            })
        }
    }

    const handleGetListChats = () => {
        if (chatCursor != null) {
            chatScrollRef.current!.style.display = 'flex'
            axios.get(CHAT_URL.CHAT_URL, {
                params: {
                    cursor: chatCursor,
                    limit: 10,
                }
            }).then(res => {
                if (res.status == 200) {
                    setChats([...chats, ...res.data.chats])
                    if (!selectedChat) {
                        const initUserSelect = res.data.chats[0]
                        if (initUserSelect) {
                            setSelectedChat({...initUserSelect.otherParticipant, chatId: initUserSelect.chatId})
                        }
                    }
                    setChatCursor(res.data.chatCursor)
                }
                chatScrollRef.current!.style.display = 'none'
            })
        }
    }

    const handleSelectChat = (userData: userDataDef, chatId: string) => {
        setSelectedChat({...userData, chatId})
    }

    const handleUpdateLastChat = (lastChat: chatDef) => {
        if(lastChat.chatId == selectedChat!.chatId){
            setChats(prevState => prevState.map(chat => chat.chatId == lastChat.chatId ? lastChat : chat))
        }
    }

    return <MainLayout>
        <div className='flex-1 py-6 px-3 flex flex-col mx-3'>
            <div className='flex items-center text-white'>
                <Avatar showStatus userStatus={selectedChat?.isOnline} className='cursor-pointer'>
                    <AvatarImage className='bg-white' src={selectedChat?.avatar} alt='avatar'/>
                    <AvatarFallback delayMs={600}>?</AvatarFallback>
                </Avatar>
                <div className='flex-1 flex flex-col justify-center ml-3'>
                    <p className='mb-0.5 text-md font-medium'>{selectedChat?.displayName}</p>
                    <p className='text-sm'>{selectedChat?.isOnline ? t("label:online") : t("label:offline")}</p>
                </div>
            </div>
            <div className='w-full h-[2px] bg-gray-300 rounded-lg my-3'/>
            <MessageSection userData={userData!} chatData={selectedChat} updateLastChat={handleUpdateLastChat}/>
        </div>
        <div className='w-[2px] h-[96%] self-center bg-gray-300 rounded-lg'/>
        <div className='w-[360px] h-full py-6 px-2 flex flex-col flex-nowrap text-white'>
            <p className='text-lg font-bold select-none'>{t("title:chat_list")}</p>
            <div className='flex-1 overflow-y-auto'>
                {chats.map((chat, index) => <div key={index}
                                                 className='flex w-full cursor-pointer items-center h-16 rounded-lg overflow-hidden hover:bg-[rgba(255,255,255,.3)]'
                                                 style={{backgroundColor: chat.chatId == selectedChat?.chatId ? '#24313e' : undefined}}
                                                 onClick={() => handleSelectChat(chat.otherParticipant, chat.chatId)}>
                        <Avatar showStatus userStatus={chat.otherParticipant.isOnline} className='cursor-pointer'>
                            <AvatarImage className='bg-white' src={chat.otherParticipant.avatar} alt='avatar'/>
                            <AvatarFallback delayMs={600}>?</AvatarFallback>
                        </Avatar>
                        <div className='flex-1 flex flex-col justify-center ml-3'>
                            <p className='mb-1 text-md font-medium'>{chat.otherParticipant.displayName}</p>
                            <div className='flex-nowrap text-sm w-full'
                                 style={{display: chat.lastMessage.content ? 'flex' : 'none'}}>
                                <p className='font-medium mr-1 truncate w-fit max-w-[50%]'>{chat.lastMessage.content}</p>
                                <p className='w-fit flex-shrink-0'>{`- ${timeSince(chat.lastMessage.createdAt)}`}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className='w-full h-10 hidden justify-center items-center' ref={chatScrollRef}>
                    <div className='h-10 w-10'>
                        <Lottie animationData={LoadingAnimation}/>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
}

export default ChatPage