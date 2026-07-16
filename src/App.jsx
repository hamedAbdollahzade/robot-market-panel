import React, {useState, useEffect} from 'react';
import {AuthContainer} from './components/auth/AuthContainer';
import './App.css'
import authService from "./services/authService.js";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // بررسی وضعیت احراز هویت هنگام لود شدن اولیه برنامه
    useEffect(() => {
        const initAuth = () => {
            try {
                const token = authService.getToken();
                const user = authService.getCurrentUser();

                if (token && user) {
                    setIsAuthenticated(true);
                    setCurrentUser(user);
                }
            } catch (err) {
                console.error("خطا در بررسی اولیه احراز هویت:", err);
                // authService.logout(); // پاکسازی در صورت بروز دیتای خراب در localStorage
            } finally {
                setCheckingAuth(false);
            }
        };

        initAuth();
    }, []);

    // هندل کردن اتمام موفقیت‌آمیز جریان احراز هویت (Login / OTP / Verify)
    const handleAuthComplete = (authData) => {
        setIsAuthenticated(true);
        setCurrentUser(authData.user || {username: authData.username});
    };

    // خروج از حساب کاربری
    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-[#f2fffd] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-[#005148] font-medium">در حال بررسی دسترسی...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f2fffd] flex items-center justify-center p-4">
            {isAuthenticated ? (
                // تمپلیت پنل مدیریت دستگاه پس از ورود موفق
                <div className="w-full max-w-4xl bg-white border border-slate-100 rounded-2xl p-8 shadow-xs">
                    <div
                        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-slate-800">پنل مدیریت دستگاه Robot Market</h1>
                            <p className="text-xs text-slate-500 mt-1">پیکربندی سنسورها، مانیتورینگ فروش و مدیریت
                                تراکنش‌ها</p>
                        </div>

                        <div className="flex items-center gap-4 self-end md:self-auto">
                            <div className="text-right">
                                <span className="text-xs text-slate-400 block">کاربر فعلی</span>
                                <span className="text-sm font-semibold text-slate-700">{currentUser?.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 active:scale-95 transition-all text-xs font-bold rounded-lg cursor-pointer"
                            >
                                خروج از سیستم
                            </button>
                        </div>
                    </div>

                    {/* بدنه پنل: محل قرارگیری چارت‌ها و سوکت‌های ارتباطی در فازهای بعدی */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[#f2fffd] p-5 rounded-xl border border-[#e2f7f4] text-right">
                            <span className="text-xs text-slate-400 block mb-1">وضعیت ارتباط با دستگاه</span>
                            <span className="text-sm font-bold text-primary flex items-center gap-2 justify-end">
                در حال مانیتورینگ
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
              </span>
                        </div>

                        <div className="bg-[#f2fffd] p-5 rounded-xl border border-[#e2f7f4] text-right">
                            <span className="text-xs text-slate-400 block mb-1">آخرین تراکنش دستگاه</span>
                            <span className="text-sm font-bold text-slate-700">موفق (کد پیگیری: #۳۸۱۲)</span>
                        </div>

                        <div className="bg-[#f2fffd] p-5 rounded-xl border border-[#e2f7f4] text-right">
                            <span className="text-xs text-slate-400 block mb-1">آخرین وضعیت وب‌سوکت</span>
                            <span className="text-sm font-bold text-info">تراکنش‌های آنلاین فعال</span>
                        </div>
                    </div>

                    <div
                        className="mt-8 p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-xs">
                        ماژول احراز هویت با موفقیت متصل شد. در مراحل بعدی ماژول‌های Socket.IO و چارت‌های تحلیل فروش به
                        این بخش افزوده خواهند شد.
                    </div>
                </div>
            ) : (
                // فرم‌های احراز هویت در صورت عدم لاگین
                <AuthContainer onAuthComplete={handleAuthComplete}/>
            )}
        </div>
    );
}

export default App;



