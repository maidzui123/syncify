import {MainLayout} from "@/pages";
import {useEffect, useRef, useState} from "react";
import {userDataDef} from "@/constants/types/auth.ts";
import axios from "axios";
import {FRIEND_URL} from "@/constants/api.ts";
import {t} from "i18next";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {Search, UserPlus, UserRoundCheck} from "lucide-react";
import {friendDef} from "@/constants/types/friend.ts";
import Resources from "@/constants/resource.ts";
import {useToast} from "@/hooks/use-toast.ts";
import {ContactList} from "@/components";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";

type friendItemProps = {
    friendReqId?: string;
    userData: userDataDef,
    isFriendRequest: boolean,
    mutualFriends: number;
    onReqAction?: (reqId: string) => void;
    onUnfriend?: (friendId: string) => void;
}

const FriendItem = (props: friendItemProps) => {

    const {userData, isFriendRequest, mutualFriends, friendReqId, onReqAction, onUnfriend} = props;

    const locale = useSelector((state:RootState) => state.locale.value)

    const { toast } = useToast()

    const handleAcceptFriendRequest = () => {
        axios.post(FRIEND_URL.ACCEPT_FRIEND_URL, {
            frRequestId: friendReqId
        }).then(res => {
            if(res.status == 200){
                toast({
                    title: t('toast:accept_friend_success')
                })
                if(onReqAction) onReqAction(friendReqId!)
            }else{
                toast({
                    title: t('toast:req_fail')
                })
            }
        })
    }

    const handleRejectFriendRequest = () => {
        axios.post(FRIEND_URL.REJECT_FRIEND_URL, {
            frRequestId: friendReqId
        }).then(res => {
            if(res.status == 200){
                toast({
                    title: t('toast:reject_friend_success')
                })
                if(onReqAction) onReqAction(friendReqId!)
            }else{
                toast({
                    title: t('toast:req_fail')
                })
            }
        })
    }

    const handleUnfriend = () => {
        axios.post(FRIEND_URL.UNFRIEND_URL, {
            friendId: userData._id
        }).then(res => {
            if(res.status == 200){
                toast({
                    title: t('toast:unfriend_success')
                })
                if(onUnfriend) onUnfriend(userData._id)
            }else{
                toast({
                    title: t('toast:req_fail')
                })
            }
        })
    }

    return <div className='h-fit rounded-lg overflow-hidden border border-gray-500 cursor-pointer'>
        <img className='w-full bg-white object-fill aspect-square' src={userData.avatar ?? Resources.avatar.default} alt='' onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = Resources.avatar.default;
        }}/>
        <div className='m-3 flex flex-col text-white'>
            <p className='font-bold text-lg mb-2'>{userData?.displayName}</p>
            {mutualFriends > 0 && <p className='font-bold text-lg mb-2'>{`${mutualFriends} ${t('label:mutual_friend').toLowerCase()}`}</p>}
            {isFriendRequest &&
                <button className='rounded-md px-0.5 py-1 bg-[#0866ff] text-white mb-2' onClick={handleAcceptFriendRequest}>{t("button:confirm")}</button>}
            {isFriendRequest &&
                <button className='rounded-md px-0.5 py-1 bg-[#ffffff1a] text-white' onClick={handleRejectFriendRequest}>{t("button:delete")}</button>}
            {!isFriendRequest &&
                <button className='rounded-md px-0.5 py-1 bg-[#0866ff] text-white' onClick={handleUnfriend}>{t("button:unfriend")}</button>}
        </div>
    </div>
}

const FriendPage = () => {

    const [friends, setFriends] = useState<userDataDef[]>([])
    const [friendCursor, setFriendCursor] = useState<string>('')
    const [friendRequests, setFriendRequests] = useState<friendDef[]>([])
    const [friendRequestCursor, setFriendRequestCursor] = useState<string>('')
    const [tabIndex, setTabIndex] = useState<number>(0)

    const mainloadingRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        handleGetListFriends()
        handleGetListFriendRequests()
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && friendCursor != '') {
                handleGetListFriends()
            }
        }, {threshold: 1})

        if (mainloadingRef.current) {
            observer.observe(mainloadingRef.current);
        }

        return () => observer.disconnect()
    }, [friends, friendCursor]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && friendCursor != '') {
                handleGetListFriendRequests()
            }
        }, {threshold: 1})

        if (mainloadingRef.current) {
            observer.observe(mainloadingRef.current);
        }

        return () => observer.disconnect()
    }, [friendRequests, friendRequestCursor]);

    const handleGetListFriends = () => {
        if (friendCursor != null) {
            mainloadingRef!.current!.style.opacity = '1'
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
                mainloadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleGetListFriendRequests = () => {
        if (friendRequestCursor != null && tabIndex == 0) {
            mainloadingRef!.current!.style.opacity = '1'
            axios.get(FRIEND_URL.GET_FRIEND_REQUEST, {
                params: {
                    cursor: friendRequestCursor,
                    limit: 20,
                    type: 'pending',
                    scope: 'me'
                }
            }).then(res => {
                if (res.status == 200) {
                    setFriendRequests([...friendRequests, ...res.data.friendsRequest])
                    setFriendRequestCursor(res.data.nextCursor)
                }
                mainloadingRef!.current!.style.opacity = '0'
            })
        }
    }

    const handleFriendReqAction = (reqId: string) => {
        const newFriendReqList = friendRequests.filter(friend => friend._id != reqId)
        setFriendRequests(newFriendReqList)
    }

    const handleUnfriendAction = (friendId: string) => {
        const newFriendsList = friends.filter(friend => friend._id!= friendId)
        setFriends(newFriendsList)
    }

    return <MainLayout>
        <div className='h-full flex-1 flex flex-col'>
            <div className='flex justify-between mx-6 my-6 text-white'>
                <div className='flex'>
                    <button className='flex items-center py-3 px-2 mr-3 border rounded-lg' style={{
                        borderColor: tabIndex == 0 ? '#0866ff' : undefined,
                        color: tabIndex == 0 ? '#0866ff' : undefined
                    }} onClick={() => setTabIndex(0)}>
                        <UserPlus size={24} color={tabIndex == 0 ? '#0866ff' : 'white'} className='mr-2'/>
                        <p>{t("button:friend_request")}</p>
                    </button>
                    <button className='flex items-center py-3 px-2 mr-3 border rounded-lg' style={{
                        borderColor: tabIndex == 1 ? '#0866ff' : undefined,
                        color: tabIndex == 1 ? '#0866ff' : undefined
                    }} onClick={() => setTabIndex(1)}>
                        <UserRoundCheck size={24} color={tabIndex == 1 ? '#0866ff' : 'white'} className='mr-2'/>
                        <p>{t("button:friend_list")}</p>
                    </button>
                </div>
                <div className='rounded-2xl p-2 flex min-w-[240px] max-w-[320px] h-fit bg-[#ffffff1a]' >
                    <Search className='mr-2' size={24} color='white'/>
                    <input className='flex-1 bg-transparent outline-none' type='text'/>
                </div>
            </div>
            <div className='mx-6 mb-4 flex-1 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 auto-rows-min gap-4 overflow-y-scroll no-scrollbar'>
                {tabIndex == 0 ? friendRequests.map((friend, index) => <FriendItem key={index}
                                                                                   userData={friend.fromUserId}
                                                                                   isFriendRequest mutualFriends={friend.mutualFriends} friendReqId={friend._id} onReqAction={handleFriendReqAction}/>)
                    : friends.map((friend, index) => <FriendItem key={index} userData={friend}
                                                                 isFriendRequest={false} mutualFriends={friend.mutualFriends} onUnfriend={handleUnfriendAction}/>)
                }
                <div className='w-full h-10 flex justify-center items-center' ref={mainloadingRef}>
                    <div className='h-10 w-10'>
                        <Lottie animationData={LoadingAnimation}/>
                    </div>
                </div>
            </div>
        </div>
        <ContactList/>
    </MainLayout>
}

export default FriendPage