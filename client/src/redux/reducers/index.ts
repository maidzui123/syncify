import localeReducer from "./localeReducer";
import authReducer from "./authReducer";
import loadingReducer from "./loadingReducer"
import editPostReducer from "./editPostReducer";
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
    locale: localeReducer,
    auth: authReducer,
    loading: loadingReducer,
    editPost: editPostReducer,
})
