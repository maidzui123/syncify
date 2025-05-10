import {SendInput} from "@/components/index.ts";
import {userDataDef} from "@/constants/types/auth.ts";
import {useEffect, useState, useRef} from 'react'
import axios from "axios";
import {CHAT_URL} from "@/constants/api.ts";
import {chatDef, messageDef} from "@/constants/types/chat.ts";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {socket} from "@/hooks/useSocket.ts";

enum messagePosition {
    FIRST = "first",
    MIDDLE = "middle",
    LAST = "last"
}

type messageSectionProps = {
    userData: userDataDef;
    chatData?: userDataDef & { chatId: string },
    updateLastChat: (lastChat: chatDef) => void;
}

type messageItemProps = {
    isSender: boolean;
    content: string;
    position: messagePosition;
}

const MessageItem = (props: messageItemProps) => {

    const { content, isSender } = props

    return <div className='flex text-white my-0.5' style={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
        <div className='px-2 py-1 w-fit max-w-[48%] h-fit rounded-lg flex text-sm' style={{ backgroundColor: isSender ? '#0084ff' : '#303030' }}>
            {content}
        </div>
    </div>
}

const MessageSection = (props: messageSectionProps) => {

    const { userData, chatData, updateLastChat } = props

    const [sendMessage, setSendMessage] = useState<string>('')
    const [messageCursor,setMessageCursor] = useState<string>('')
    const [message, setMessage] = useState<messageDef[]>([])

    const messageLoadingRef = useRef<HTMLDivElement>(null)
    const messageScrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        initSocket()
    }, []);

    useEffect(() => {
        if(chatData){
            handleGetChatMessage(true)
        }
    }, [chatData]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && messageCursor != null) {
                handleGetChatMessage(false)
            }
        }, {threshold: 1})

        if (messageLoadingRef.current) {
            observer.observe(messageLoadingRef.current);
        }

        return () => observer.disconnect()
    }, [message, messageCursor]);

    const handleGetChatMessage = (isChangeChat: boolean) => {

        if(chatData && (messageCursor != null || isChangeChat)){
            messageLoadingRef.current!.style.display = 'flex'
            axios.get(CHAT_URL.CHAT_MESSAGE_URL + `/${chatData.chatId}`, {
                params: {
                    cursor: isChangeChat ? '' : messageCursor,
                    limit: 20,
                }
            }).then(res => {
                if(res.status == 200){
                    const messageList = isChangeChat ? res.data.messages.reverse() : [...message, ...res.data.messages.reverse()]
                    setMessage(messageList);
                    setMessageCursor(res.data.nextCursor)
                    messageScrollRef.current!.scrollTop = messageScrollRef.current!.scrollHeight
                }
                messageLoadingRef.current!.style.display = 'none'
            })
        }
    }

    const handleSendMessage = () => {
        if(sendMessage != ''){
            axios.post(CHAT_URL.CHAT_MESSAGE_URL, {
                chatId: chatData!.chatId,
                message: sendMessage,
                type: "text",
                socketId: socket.id
            }).then(res => {
                if(res.status == 200){
                    updateLastChat({
                        chatId: chatData!.chatId,
                        lastMessage: {
                            content: sendMessage,
                            createdAt: res.data.content.createdAt,
                            senderId: res.data.content.senderId,
                        },
                        otherParticipant: chatData!
                    })
                    setMessage(prevState => [...prevState, res.data.content])
                    setSendMessage('')
                }
            })
        }
    }

    const initSocket = () => {
        if (socket) {
            socket.on("chatMessage", data => {
                console.log(data)
                // if(chatData?.chatId == data.msgData.chatId) {
                    setMessage(prevState => [...prevState, data.msgData])
                // }
            })
        }
    }

    return <div className='flex flex-col flex-1 overflow-hidden'>
        <div className='flex-1 overflow-y-auto flex flex-col transparent-scrollbar px-2 py-3' ref={messageScrollRef}>
            <div className='w-full h-10 hidden justify-center items-center' ref={messageLoadingRef}>
                <div className='h-10 w-10'>
                    <Lottie animationData={LoadingAnimation}/>
                </div>
            </div>
            {message.map((messageItem, index) => {
                return <MessageItem key={index} isSender={messageItem.isSender} content={messageItem.content} position={messagePosition.FIRST}/>
            })}
        </div>
        <SendInput avatar={userData?.avatar} value={sendMessage} onChange={(value) => setSendMessage(value)} onSend={handleSendMessage}/>
    </div>
}

export default MessageSection