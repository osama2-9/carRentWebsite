'use client'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import axiosInstance from "../axios/axios"
import { logout, login, setLoading, setAuthChecked } from "./userSlice"
import { UserSliceState } from './userSlice'

interface UseAuthResponse {
    isLoggedIn: boolean;
    user: UserSliceState['user'];
    isLoading: boolean;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuth = (): UseAuthResponse => {
    const dispatch = useDispatch()
    const { isLoggedIn, user, isLoading } = useSelector((state: RootState) => state.auth)

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout', {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            })
            dispatch(logout())

        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            dispatch(logout())
        }
    }

    const checkAuth = async () => {
        dispatch(setLoading(true));
        try {
            const res = await axiosInstance.get("/auth/me", { withCredentials: true });
            if (res.data?.isAuthenticated && res.data.user) {
                dispatch(login(res.data.user));
            } else {
                dispatch(logout());
            }
        } catch {
            dispatch(logout());
        } finally {
            dispatch(setAuthChecked());
        }
    };


    return {
        isLoggedIn,
        user,
        isLoading,
        logout: handleLogout,
        checkAuth
    }
}