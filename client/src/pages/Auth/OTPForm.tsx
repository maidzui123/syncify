import {LOGIN_TYPE} from "@/constants/enum/auth.ts";
import Lottie from "lottie-react";
import Resources from "@/constants/resource.ts";
import {Countdown, OTP} from "@/components";
import {motion} from "motion/react";
import {Button} from "@/components/ui";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios";
import {AUTH_URL} from "@/constants/api.ts";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store.ts";
import {setAuthData} from "@/redux/reducers/authReducer";
import {useToast} from "@/hooks/use-toast";
import {setLoading} from "@/redux/reducers/loadingReducer";

type OTPFormProps = {
    handleBack: () => void,
    onDone: () => void
}

const OTPForm = (props: OTPFormProps) => {

    const { handleBack, onDone } = props

    const [isOTPExpired, setIsOTPExpired] = useState<boolean>(false)
    const auth = useSelector((state: RootState) => state.auth.value)
    const dispatch = useDispatch()

    const {t} = useTranslation()
    const { toast } = useToast()

    const handleVerifyOTP = (otp: string) => {
        dispatch(setLoading(true))
        axios.post(AUTH_URL.VERIFY_OTP_URL, {
            code: otp,
            email: auth.email
        }).then(res => {
            dispatch(setLoading(false))
            if(res.status == 200){
                dispatch(setAuthData({
                    email: auth.email,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                    loginType: LOGIN_TYPE.EMAIL,
                    isNewUser: true
                }))
                onDone()
                toast({
                    title: t("toast:right_otp"),
                })
            }
        }, res => {
            toast({
                title: res.message,
            })
        })
    }

    return <motion.div
        className="flex flex-col items-center relative pb-8 pt-4 px-16 rounded-xl bg-white h-[360px] aspect-[1.5] shadow shadow-gray-500"
        initial={{x: 999, opacity: 0}} animate={{x: 0, opacity: 1, transition: {duration: .6}}}
        exit={{x: -999, opacity: 0, transition: {duration: .6}}}>
        <div className='absolute top-3 left-3 p-3 rounded-2xl cursor-pointer hover:bg-gray-300'
             onClick={handleBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-corner-down-left">
                <polyline points="9 10 4 15 9 20"/>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"/>
            </svg>
        </div>
        <div className='w-[120px]'>
            <Lottie animationData={Resources.lottie.otp}/>
        </div>
        <h3 className='font-bold text-2xl'>{t("title:enter_otp")}</h3>
        <OTP fieldNum={6} onComplete={(otp) => handleVerifyOTP(otp)}/>
        <div className='w-full flex justify-end'>
            {isOTPExpired ?
                <motion.div className='flex items-center' initial={{opacity: 1}}
                            animate={{opacity: 1, transition: {duration: .5}}}
                            exit={{opacity: 0, transition: {duration: .5}}}>
                    <p className='mr-1 text-sm'>{t("label:dont_receive_otp") + "?"}</p>
                    <Button className='p-0 text-blue-400 hover:text-red-600 text-sm'
                            variant='link' onClick={() => {
                    }}>{t("button:resend_otp")}</Button>
                </motion.div> :
                <motion.div className='flex items-center' initial={{opacity: 1}}
                            animate={{opacity: 1, transition: {duration: .5}}}
                            exit={{opacity: 0, transition: {duration: .5}}}>
                    <p className='mr-1 text-sm'>{t("label:otp_expired_after")}</p>
                    <Countdown initValue={60} onFinish={() => setIsOTPExpired(true)}/>
                </motion.div>}
        </div>
    </motion.div>
}

export default OTPForm