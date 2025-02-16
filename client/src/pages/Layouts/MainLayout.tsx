import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui"
import Resources from "@/constants/resource";
import {ReactNode, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from "@/redux/store"
import {Bell, ContactRound, Home, LogOut, MessageCircle, Plus, Search, Settings, Users} from 'lucide-react';
import {NewPostModal} from "@/components";
import {useLocation, useNavigate} from "react-router";
import {t} from "i18next";
import {useAuth} from "@/hooks";
import {toggleModal} from "@/redux/reducers/editPostReducer";

type mainLayoutProps = {
    children: ReactNode;
}

const tabIndex = ['/', '/search', '/chats', '/notifications', '/profile','/friends']

const MainLayout = (props: mainLayoutProps) => {

    const {children} = props

    const [activeTab, setActiveTab] = useState<number>(0)

    const userData = useSelector((state: RootState) => state.auth.value)
    const editPostData = useSelector((state: RootState) => state.editPost.value)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { logOut } = useAuth()

    useEffect(() => {
        highlightActiveTab()
    }, []);

    const highlightActiveTab = () => {
        const index = tabIndex.findIndex(item => item == location.pathname)
        setActiveTab(index)
    }

    return <div className='w-screen h-screen flex bg-[#0a0a0a] overflow-hidden'>
        <div className='w-[76px] h-full py-6 flex flex-col items-center justify-between'>
            <img className='w-[52px] h-[52px]' src={Resources.logo.sincifyLogo} alt='logo'/>
            <div className='flex flex-col items-center'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 0 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/')}>
                            <Home color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:home")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 1 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/search')}>
                            <Search color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:search")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 2 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/chats')}>
                            <MessageCircle color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:chat")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className='p-1 my-3 cursor-pointer rounded-full transition bg-white'
                                onClick={() => dispatch(toggleModal())}>
                            <Plus color='#000000' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:new_post")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 3 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/profile')}>
                            <Bell color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:notification")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 4 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/profile')}>
                            <ContactRound color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:profile")}</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button style={{backgroundColor: activeTab == 5 ? "rgba(255,255,255,.3)" : 'transparent'}}
                                className='p-2 my-3 cursor-pointer rounded-lg transition hover:bg-[rgba(255,255,255,.3)]'
                                onClick={() => navigate('/friends')}>
                            <Users color='#ffffff' size={32}/>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side='right' sideOffset={12}>
                        <p className='text-base'>{t("tooltip:friend")}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className='mb-6 cursor-pointer'>
                        <AvatarImage className='bg-white' src={userData?.user?.avatar} alt='avatar'/>
                        <AvatarFallback delayMs={600}>?</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#181818] text-white" side='right' align='end' sideOffset={18}>
                    <DropdownMenuLabel className='p-2 font-bold text-lg'>{userData?.user?.displayName}</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem className='group p-2 hover:bg-gray-300 hover:text-black cursor-pointer'>
                        <Settings className='group-hover:text-black text-white' size={24}/>
                        <p className='text-base'>{t("button:setting")}</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='group p-2 hover:bg-gray-300 hover:text-red-600 cursor-pointer' onClick={logOut}>
                        <LogOut className='group-hover:text-red-600 text-red-600' size={24}/>
                        <p className='group-hover:text-red-600 text-red-600 text-base'>{t("button:logout")}</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className='flex-1 h-full flex'>
            {children}
        </div>
        <NewPostModal open={editPostData.open} initPostData={editPostData.editPostData} userData={userData?.user} action={editPostData.action}/>
    </div>
}

export default MainLayout