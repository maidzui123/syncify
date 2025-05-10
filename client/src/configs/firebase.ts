// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { signInGGData, signOutGGData } from "../constants/types/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwSwft8u77cWBedcGn8_PY5EL1Zzs5kVk",
  authDomain: "syncify-4aa34.firebaseapp.com",
  projectId: "syncify-4aa34",
  storageBucket: "syncify-4aa34.firebasestorage.app",
  messagingSenderId: "23645472352",
  appId: "1:23645472352:web:2ac59d31293a78924e6505",
  measurementId: "G-PKJDMJQ5BK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();

export const signInGG = async (): Promise<signInGGData> => {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      return {
        token,
        user,
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {
        errorCode,
        errorMessage
      }
    });
};

export const signOutGG = async (): Promise<signOutGGData> => {
  return signOut(auth)
    .then(() => {
      return {
        code: 0,
        msg: 'Logout successfully!'
      }
    })
    .catch((error) => {
      return {
        code: 1,
        msg: 'Logout fail!',
        errorMsg: error.message
      }
    });
};
