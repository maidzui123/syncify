import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { store } from '@/redux/store'
import { clearAuthData, setAuthData } from "@/redux/reducers/authReducer";
import { BASE_URL, AUTH_URL } from '@/constants/api'
import {setLoading} from "@/redux/reducers/loadingReducer";

axios.defaults.baseURL = BASE_URL;
axios.defaults.timeout = 5000;

const onRequestSuccess = (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.value.accessToken
    if (token) {
        config.headers.Authorization = "Bearer " + token
    }
    return config;
};

const onResponseSuccess = (response: AxiosResponse) => {
    /* eslint-disable no-prototype-builtins */
    if(response.data.hasOwnProperty("data")){
        response.data = response.data.data
    }
    return response;
};

const onResponseError = async (error: AxiosError) => {
    if (
        error.response?.status !== 401
    ) {
        const errMessage = error.response?.data || error?.response || error;
        store.dispatch(setLoading(false))
        return Promise.reject(errMessage);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (error.config?.retryAttempted) {
        const errMessage = error.response?.data || error?.response || error;
        store.dispatch(setLoading(false))
        return Promise.reject(errMessage);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    error.config!.retryAttempted = true;

    const { refreshToken, loginType, email } = store.getState().auth.value
    try{
        const res = await axios.post(AUTH_URL.REFRESH_URL, { refreshToken })
        store.dispatch(setAuthData({ email, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken, loginType }))
        error.config!.headers.Authorization = 'Bearer ' + res.data.accessToken
        return axios(error.config!)
    } catch (e) {
        store.dispatch(clearAuthData())
        return Promise.reject(e)
    } finally {
        store.dispatch(setLoading(false))
    }
};

axios.interceptors.request.use(onRequestSuccess)
axios.interceptors.response.use(onResponseSuccess, onResponseError)