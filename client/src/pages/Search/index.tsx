import {MainLayout} from "@/pages";
import {ContactList} from "@/components";
import {Hash, Search} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage, Button, Input} from "@/components/ui";
import {useEffect, useRef, useState} from "react";
import { debounce } from "lodash";
import axios from "axios";
import {FRIEND_URL} from "@/constants/api.ts";
import {userDataDef} from "@/constants/types/auth.ts";
import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/lotties/loading.json";
import {t} from "i18next";
import {useToast} from "@/hooks/use-toast.ts";
import {useNavigate} from "react-router";

const SearchPage = () => {

    const [keyword, setKeyword] = useState<string>('')
    const [tag, setTag] = useState<string>('')
    const [searchCursor, setSearchCursor] = useState<string>('')
    const [searchData, setSearchData] = useState<userDataDef[]>([])

    const searchLoadingRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()
    const navigate = useNavigate();

    useEffect(() => {
        setSearchCursor('')
        setSearchData([])
        if(keyword || tag || searchData.length == 0){
            handleSearch(keyword, tag)
        }
        return () => handleSearch.cancel();
    }, [keyword, tag]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && searchCursor != '') {
                handleGetSearchData(keyword, tag)
            }
        }, { threshold: 1 })

        if (searchLoadingRef.current) {
            observer.observe(searchLoadingRef.current);
        }

        return () => observer.disconnect()
    }, [searchData, searchCursor]);

    const handleSearch = debounce((keyword: string, tag: string) => {
        handleGetSearchData(keyword, tag)
    }, 500)

    const handleGetSearchData = (keyword: string, tag: string) => {
        if(searchCursor != null){
            searchLoadingRef.current!.style.opacity = '1'
            axios.get(FRIEND_URL.SEARCH_USER_URL, {
                params: {
                    username: keyword,
                    tag: tag,
                    cursor: searchCursor,
                    limit: 10,
                }
            }).then(res => {
                if(res.status == 200){
                    setSearchCursor(res.data.nextCursor)
                    setSearchData([...searchData, ...res.data.users])
                }
                searchLoadingRef.current!.style.opacity = '0'
                console.log(res.data)
            })
        }
    }

    const handleSendFriendReq = (id: string) => {
        axios.post(FRIEND_URL.SEND_FRIEND_REQUEST, {
            friendId: id,
        }).then(res => {
            if(res.status == 200){
                toast({
                    title: t('toast:accept_friend_success')
                })
            }else{
                toast({
                    title: t('toast:req_fail')
                })
            }
        })
    }

    return <MainLayout>
        <div className='h-full flex flex-1 justify-center text-white'>
            <div className='min-w-[640px] w-[80%] my-6'>
                <div className='w-full h-full rounded-xl flex flex-col items-center mb-3 p-6 bg-[#181818]'>
                    <div className='flex rounded-xl overflow-hidden mb-6 w-full border-blue-500 border bg-black h-12'>
                        <div className='flex flex-1 items-center'>
                            <div className='flex w-10 justify-center items-center'>
                                <Search size={24} color='#777777'/>
                            </div>
                            <Input style={{ boxShadow: 'none' }} className='flex-1 border-0 border-r !rounded-r-none border-blue-500' value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                        </div>
                        <div className='flex w-40 items-center'>
                            <div className='flex w-10 justify-center items-center'>
                                <Hash size={24} color='#777777'/>
                            </div>
                            <Input style={{ boxShadow: 'none' }} className='flex-1 border-0 shadow-transparent' value={tag} onChange={(e) => setTag(e.target.value)}/>
                        </div>
                    </div>
                    <div className='w-full overflow-y-auto no-scrollbar'>
                        {searchData.map((item, index) => {
                            return <div key={index} className='flex items-center my-4 cursor-pointer' onClick={() => navigate(`/profile/${item._id}`)}>
                                <Avatar className='cursor-pointer h-16 w-16'>
                                    <AvatarImage className='bg-white' src={item?.avatar} alt='avatar'/>
                                    <AvatarFallback delayMs={600}>?</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col flex-1 ml-3 justify-around'>
                                    <p className='font-medium text-xl mb-2'>{item.username}</p>
                                    <p>{item.mutualFriends + ` ${t("label:mutual_friend").toLowerCase()}`}</p>
                                </div>
                                {!item.isFriend && <Button className='bg-blue-500 hover:bg-blue-300' onClick={() => handleSendFriendReq(item._id)}>{t("button:add_friend")}</Button>}
                            </div>
                        })}
                        <div className='w-full h-10 flex justify-center items-center' ref={searchLoadingRef}>
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

export default SearchPage;