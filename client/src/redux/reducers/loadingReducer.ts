import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: { value: boolean } = {
    value: false
}

export const loadingReducer = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.value = action.payload ?? false
        }
    }
})

export const { setLoading } = loadingReducer.actions
export default loadingReducer.reducer