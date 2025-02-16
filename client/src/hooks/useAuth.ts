import {useSelector, useDispatch} from "react-redux"
import type {RootState} from "@/redux/store"
import {clearAuthData, setAuthData, setUserInfo} from "@/redux/reducers/authReducer"
import {signInGG, signOutGG} from "@/configs/firebase"
import {LOGIN_TYPE, REGISTER_TYPE} from "@/constants/enum/auth";
import {signInDef} from "@/constants/types/auth";
import {AUTH_URL, PROFILE_URL} from "@/constants/api";
import axios from 'axios'
import {signUpDef} from "@/utils/validate";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from '@/hooks/useSocket'

const useAuth = () => {

    const {accessToken, refreshToken, loginType, isNewUser} = useSelector((state: RootState) => state.auth.value)

    const dispatch = useDispatch()

    const getAuthDataFromGG = async () => {
        const data = await signInGG()
        if(data){
            const accessToken = await data.user!.getIdToken()
            const loginRes = await axios.post(AUTH_URL.LOGIN_GOOGLE_URL, {
                accessToken
            })
            dispatch(setAuthData({
                email: data.user!.email as string,
                accessToken: loginRes.data.accessToken,
                refreshToken: loginRes.data.refreshToken,
                loginType: LOGIN_TYPE.GOOGLE,
            }))
            const userDataRes = await axios.get(PROFILE_URL.GET_PROFILE_URL)
            dispatch(setUserInfo(userDataRes.data))
            return loginRes.status == 200;
        }
    }

    const logIn = async (loginType: LOGIN_TYPE, loginData?: signInDef) => {
        if (loginType === LOGIN_TYPE.EMAIL) {
            const res = await axios.post(AUTH_URL.LOGIN_URL, loginData)
            if(res.status == 200) {
                dispatch(setAuthData({
                    email: loginData!.email,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                    loginType: LOGIN_TYPE.EMAIL,
                }))
                const userDataRes = await axios.get(PROFILE_URL.GET_PROFILE_URL)
                dispatch(setUserInfo(userDataRes.data))
            }
            return res.status == 200
        } else if (loginType === LOGIN_TYPE.GOOGLE) {
            return await getAuthDataFromGG()
        }
    }

    const signUp = async (loginType: REGISTER_TYPE, registerData?: signUpDef) => {
        if (loginType === REGISTER_TYPE.EMAIL) {
            const res = await axios.post(AUTH_URL.REGISTER_URL, {
                email: registerData!.email,
                username: registerData!.email,
                password: registerData!.confirmPassword
            })
            return res.status == 200;
        } else if (loginType === REGISTER_TYPE.GOOGLE) {
            return await getAuthDataFromGG()
        }
    }

    const logOut = async () => {
        if (loginType === LOGIN_TYPE.GOOGLE) {
            await signOutGG();
        }
        await AsyncStorage.removeItem("auth")
        dispatch(clearAuthData())
        socket.disconnect()
    }

    return {
        isAuth: accessToken != '' && refreshToken != '' && !isNewUser,
        accessToken,
        refreshToken,
        logIn,
        signUp,
        logOut
    }
}

export default useAuth