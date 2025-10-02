import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF" | "CUSTOMER";
}

export interface UserSliceState {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
}

const initialState: UserSliceState = {
    isLoggedIn: false,
    user: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.isLoggedIn = true;
            state.user = action.payload;
            state.isLoading = false;
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.isLoading = false;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload;
        },
        setAuthChecked(state) {
            state.isLoading = false;
            if (state.user && !state.isLoggedIn) {
                state.isLoggedIn = true;
            }
        },
    },
});

export const { login, logout, setLoading, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
