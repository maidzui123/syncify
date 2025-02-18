import LoginBG from '@/assets/backgrounds/login_bg.webp'
import LoginBG1 from '@/assets/backgrounds/login_bg1.webp'
import GoogleIcon from '@/assets/icons/google.svg'
import LogoSyncify from '@/assets/logos/logo_syncify.webp'
import OTP from '@/assets/lotties/otp.json'
import Email from '@/assets/lotties/email.json'
import ResetPassword from '@/assets/lotties/resetpass.json'
import AvatarDefault from '@/assets/avatar/jack.jpeg' // Add the avatar image file path here

const Resources = {
    backgrounds: {
        LoginBG,
        LoginBG1
    },
    icon: {
        google: GoogleIcon
    },
    logo: {
        sincifyLogo: LogoSyncify
    },
    lottie: {
        otp: OTP,
        email: Email,
        resetPass: ResetPassword
    },
    avatar: {
        default: AvatarDefault
    }
}

export default Resources