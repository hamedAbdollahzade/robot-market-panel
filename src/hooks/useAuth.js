import {useState, useCallback} from 'react';
import authService from "../services/authService.js";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!authService.getToken());

    const login = useCallback(async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.login({username, password});

            // اگر لاگین موفق بود و کاربر نیاز به تغییر رمز عبور نداشت
            if (response.token && !response.isFirstTime) {
                authService.setToken(response.token);
                if (response.user) {
                    authService.setUser(response.user);
                    setCurrentUser(response.user);
                }
                setIsAuthenticated(true);
            }

            return response; // پاسخ را کامل برمی‌گردانیم تا کامپوننت تصمیم بگیرد (مثلا برای isFirstTime)
        } catch (err) {
            setError(err.message || 'خطا در برقراری ارتباط');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // تابع ارسال کد OTP
    const sendOtp = useCallback(async (username) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.sendOtp({username});
            return response;
        } catch (err) {
            setError(err.message || 'خطا در ارسال کد تایید');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // تابع تایید کد OTP
    const verifyOtp = useCallback(async (code) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.verifyOtp({code});
            if (response.token) {
                authService.setToken(response.token);
                if (response.user) {
                    authService.setUser(response.user);
                    setCurrentUser(response.user);
                }
                setIsAuthenticated(true);
            }
            return response;
        } catch (err) {
            setError(err.message || 'کد وارد شده معتبر نیست');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // تابع تغییر رمز عبور
    const changePassword = useCallback(async (username, oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.changePassword({username, oldPassword, newPassword});
            return response;
        } catch (err) {
            setError(err.message || 'خطا در تغییر رمز عبور');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // خروج از حساب کاربری
    const logout = useCallback(() => {
        authService.clearAuth();
        setCurrentUser(null);
        setIsAuthenticated(false);
    }, []);

    return {
        loading,
        error,
        currentUser,
        isAuthenticated,
        login,
        sendOtp,
        verifyOtp,
        changePassword,
        logout,
    };
};
