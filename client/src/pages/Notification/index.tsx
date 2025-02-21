import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui";
import {t} from "i18next";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {useEffect, useRef, useState} from 'react'
import axios from "axios";
import {NOTIFICATION_URL} from "@/constants/api.ts";
import {MainLayout} from "@/pages";
import {notiDef, targetUserDef} from "@/constants/types/notification.ts";
import {timeSince} from "@/utils/convert.ts";
import {ContactList} from "@/components";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";

const NotificationPage = () => {

    const [notifications, setNotifications] = useState<notiDef[]>([])
    const [notiCursor, setNotiCursor] = useState<string>('')

    const notiLoadingRef = useRef<HTMLDivElement>(null)
    const locale = useSelector((state:RootState) => state.locale.value)

    useEffect(() => {
        handleGetNotifications()
    }, [])

    const handleGetNotifications = () => {
        if(notiCursor != null){
            notiLoadingRef!.current!.style.opacity = '1'
            axios.get(NOTIFICATION_URL.GET_ALL_NOTIFICATIONS_URL, {
                params: {
                    cursor: notiCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200) {
                    console.log(res)
                    setNotifications([...notifications, ...res.data.notifications])
                    setNotiCursor(res.data.nextCursor)
                }
                notiLoadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleClickNotiItem = (notiData: notiDef, index: number) => {
        axios.post(NOTIFICATION_URL.MARK_AS_READ_URL, {
            notificationId: notiData._id
        }).then(res => {
            if(res.status == 200){
                setNotifications(prevNotifications =>
                    prevNotifications.map((noti, i) =>
                        i === index ? { ...noti, isRead: true } : noti
                    )
                );
            }
        })
    }

    return <MainLayout>
        <div className='h-full flex flex-1 justify-center text-white'>
            <div className='min-w-[640px] w-[80%] my-6'>
                <div className='w-full h-full rounded-xl flex flex-col items-center mb-3 bg-[#181818] p-4'>
                    <p className='text-2xl font-bold mb-6 mt-4'>{t("title:notifications")}</p>
                    <div className='w-full flex-1 overflow-y-auto no-scrollbar'>
                        {notifications.map((notification, index) => {
                            const targetData: targetUserDef = JSON.parse(notification.payload)
                            return <div key={index} className='flex items-center h-[72px] w-full rounded-lg p-4 cursor-pointer hover:bg-[rgba(255,255,255,.3)]' onClick={() => handleClickNotiItem(notification, index)}>
                                <Avatar className='cursor-pointer'>
                                    <AvatarImage className='bg-white' src={targetData.avatar} alt='avatar'/>
                                    <AvatarFallback delayMs={600}>?</AvatarFallback>
                                </Avatar>
                                <div className='flex-1 ml-3'>
                                    <p>{t(`notification:${targetData.type}`, { name: targetData.displayName })}</p>
                                    <p>{timeSince(notification.createdAt)}</p>
                                </div>
                                {notification.isRead && <div className='h-2 w-2 bg-blue-700 rounded-full mx-3'/>}
                            </div>
                        })}
                        <div className='w-full h-10 flex justify-center items-center' ref={notiLoadingRef}>
                            <div className='h-10 w-10'>
                                <Lottie animationData={LoadingAnimation}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ContactList/>
    </MainLayout>
}

export default NotificationPage;