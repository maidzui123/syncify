import { User } from "firebase/auth";
import type {userInfoDef} from "@/utils/validate";

export type signInGGData = {
      errorCode?: number,
      errorMessage?: string,
      token?: string;
      user?: User;
}

export type signOutGGData = {
  code: number;
  msg: string;
  errorMsg?: string;
};

export type signInDef = {
    email: string;
    password: string;
}

export type signUpDef = signInDef & {
    username: string;
    confirmPassword: string;
}

export type forgetPasswordDef = {
    email: string;
}


export type resetPasswordDef = {
    password: string;
    confirmPassword: string;
}

export type userDataDef = userInfoDef & { avatar: string, _id: string, accessToken: string, isOnline: boolean, mutualFriends: number, username: string, dob: string, tel: string, bio: string, isFriend: boolean }
