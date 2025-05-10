import type {PayloadAction} from "@reduxjs/toolkit";
import {createSlice} from "@reduxjs/toolkit";
import {LOGIN_TYPE} from "@/constants/enum/auth";
import {userDataDef} from "@/constants/types/auth";

type authDef = {
  accessToken?: string;
  refreshToken?: string;
  email?: string;
  loginType?: LOGIN_TYPE;
  isNewUser?: boolean;
  user?: userDataDef;
};

const initialState: { value: authDef } = {
    value: {
        accessToken: '',
        refreshToken: '',
        email: '',
        isNewUser: false
    }
}

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<authDef>) => {
            state.value = {
                accessToken: action.payload.accessToken ?? initialState.value.accessToken,
                refreshToken: action.payload.refreshToken ?? initialState.value.refreshToken,
                email: action.payload.email ?? initialState.value.email,
                loginType: action.payload.loginType ?? state.value.loginType,
                isNewUser: action.payload.isNewUser ?? false,
                user: action.payload.user?? state.value.user
            }
        },
        setNewUser: (state, action: PayloadAction<boolean>) => {
          state.value.isNewUser = action.payload
        },
        setUserInfo: (state, action: PayloadAction<userDataDef>) => {
            state.value.user = action.payload
        },
        clearAuthData: (state) => {
            state.value = initialState.value
        }
    }
})

export const { setAuthData, setNewUser, setUserInfo, clearAuthData } = authReducer.actions
export default authReducer.reducer