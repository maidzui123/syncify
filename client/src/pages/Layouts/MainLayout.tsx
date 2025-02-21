import {
    Avatar,
    AvatarFallback,
    AvatarImage, Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger, Input, Label,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui"
import Resources from "@/constants/resource";
import {ReactNode, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from "@/redux/store"
import {Bell, ContactRound, Home, LogOut, MessageCircle, Plus, Search, Users, Lock, Languages} from 'lucide-react';
import {Modal, NewPostModal} from "@/components";
import {useLocation, useNavigate} from "react-router";
import i18n, {t} from "i18next";
import {useAuth} from "@/hooks";
import {toggleModal} from "@/redux/reducers/editPostReducer";
import {SubmitHandler, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {changePasswordDef, changePasswordSchema} from "@/utils/validate";
import {setLocale} from "@/redux/reducers/localeReducer";
import {AUTH_URL} from "@/constants/api";
import axios from "axios";
import { useToast} from "@/hooks/use-toast";

type mainLayoutProps = {
    children: ReactNode;
}

const tabIndex = ['/search', '/chats', '/notifications', '/profile','/friends']

const MainLayout = (props: mainLayoutProps) => {

    const {children} = props

    const [activeTab, setActiveTab] = useState<number>(0)
    const [changePwModal, setChangePwModal] = useState<boolean>(false)

    const userData = useSelector((state: RootState) => state.auth.value)
    const locale = useSelector((state: RootState) => state.locale.value)
    const editPostData = useSelector((state: RootState) => state.editPost.value)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { logOut } = useAuth()
    const changePassFormRef = useRef<HTMLFormElement>(null)
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors }, reset
    } = useForm<changePasswordDef>({
        resolver: yupResolver(changePasswordSchema),
    });

    useEffect(() => {
        highlightActiveTab()
        i18n.changeLanguage(locale).then()
    }, []);

    useEffect(() => {
        reset()
    }, [changePwModal])

    const highlightActiveTab = () => {
        const index = tabIndex.findIndex(item => location.pathname.includes(item))
        if(index != -1){
            setActiveTab(index + 1)
        }else{
            setActiveTab(0)
        }
    }

    const handleChangePassword: SubmitHandler<changePasswordDef> = (data) => {
        console.log(data)
        axios.post(AUTH_URL.CHANGE_PASSWORD_URL, {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword
        }).then(res => {
            console.log(res);
            if(res.status == 200){
                toast({
                    title: t('toast:change_pass_success')
                })
            }else{
                toast({
                    title: t('toast:change_pass_fail')
                })
            }
        })
    };

    const handleChangeLocale = async () => {
        if(locale == 'vi'){
            await i18n.changeLanguage('en')
            dispatch(setLocale("en"))
        }else{
            await i18n.changeLanguage('vi')
            dispatch(setLocale("vi"))
        }
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
                                onClick={() => navigate('/notifications')}>
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
                                onClick={() => navigate('/profile/me')}>
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
                    <div className='flex px-2 py-1.5 text-sm items-center cursor-pointer' onClick={handleChangeLocale}>
                        <Languages className='text-white' size={24}/>
                        <p className='text-base'>{t("button:language")}</p>
                        <div className='flex-1'/>
                        <img width={32} src={locale == 'vi' ? Resources.icon.viFlag : Resources.icon.ukFlag} alt=''/>
                    </div>
                    <DropdownMenuItem className='group p-2 hover:bg-gray-300 hover:text-black cursor-pointer' onClick={() => setChangePwModal(true)}>
                        <Lock className='group-hover:text-black text-white' size={24}/>
                        <p className='text-base'>{t("button:change_pass")}</p>
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
        <Modal style={{ backgroundColor: '#181818', color: 'white' }} width={480} open={changePwModal} onClose={() => setChangePwModal(false)} title={t("title:change_pass")} showBottom={false}>
            <form ref={changePassFormRef} className='w-full' onSubmit={handleSubmit(handleChangePassword)}>
                <div className='mt-4 w-full'>
                    <Label className="mb-1" htmlFor="currPass">
                        {t("label:current_pass")}
                    </Label>
                    <Input {...register("currentPassword")} id="currPass" type="password" required />
                    <p className="text-red-500 text-xs h-4 align-middle">
                        {errors.currentPassword?.message}
                    </p>
                </div>
                <div className='mt-2'>
                    <Label className="mb-1" htmlFor="newPass">
                        {t("label:new_password")}
                    </Label>
                    <Input {...register("newPassword")} id="newPass" type="password" required />
                    <p className="text-red-500 text-xs h-4 align-middle">
                        {errors.newPassword?.message}
                    </p>
                </div>
                <div className='mt-2'>
                    <Label className="mb-1" htmlFor="confirmPass">
                        {t("label:confirm_password")}
                    </Label>
                    <Input {...register("confirmPassword")} id="confirmPass" type="password" required />
                    <p className="text-red-500 text-xs h-4 align-middle">
                        {errors.confirmPassword?.message}
                    </p>
                </div>
                <Button variant='outline' className='text-white bg-transparent float-end'>{t("button:confirm")}</Button>
            </form>
        </Modal>
    </div>
}

export default MainLayout