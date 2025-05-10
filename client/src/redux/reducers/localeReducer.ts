import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type localeType = 'vi' | 'en'

const initialState: { value: localeType }  = {
    value: 'vi'
}

export const localeReducer = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        setLocale: (state, action: PayloadAction<'vi' | 'en'>) => {
            state.value = action.payload
        }
    }
})

export const { setLocale } = localeReducer.actions
export default localeReducer.reducer