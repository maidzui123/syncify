import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {postDef} from "@/constants/types/post";

export enum POST_MODAL_ACTION {
    CREATE,
    EDIT,
}

export type editPostDef = {
    open: boolean;
    editPostData?: postDef;
    action?: POST_MODAL_ACTION;
}

const initialState: { value: editPostDef } = {
    value: {
        open: false
    }
}

export const editPostReducer = createSlice({
    name: 'editPost',
    initialState,
    reducers: {
        toggleModal: (state) => {
          state.value.open = !state.value.open;
        },
        setEditPost: (state, action: PayloadAction<editPostDef>) => {
            state.value = {...state.value,...action.payload}
        },
        clearEditPost: (state) => {
            state.value = {...initialState.value};
        }
    }
})

export const { toggleModal, setEditPost, clearEditPost } = editPostReducer.actions
export default editPostReducer.reducer