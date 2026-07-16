import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { OtpForm } from './OtpForm';
import { ChangePassForm } from './ChangePassForm';
import { useAuth } from '../../hooks/useAuth';

export const AuthContainer = ({ onAuthComplete }) => {
    const [view, setView] = useState('login'); // 'login' | 'otp' | 'change-pass'
    const [tempUsername, setTempUsername] = useState('');
    const { loading, login, sendOtp, verifyOtp, changePassword } = useAuth();
    const [innerError, setInnerError] = useState('');

    // مدیریت جریان لاگین سنتی
    const handleLoginSubmit = async ({ username, password }) => {
        setInnerError('');
        try {
            const response = await login(username, password);

            // اگر ورود برای بار اول باشد، به ویوی تغییر رمز هدایت می‌شود
            if (response.isFirstTime) {
                setTempUsername(username);
                setView('change-pass');
            } else if (response.token) {
                onAuthComplete(response);
            }
        } catch (err) {
            throw err; // خطا را برای نمایش در LoginForm بالا می‌اندازیم
        }
    };

    // سوئیچ به حالت OTP و ارسال اولین کد
    const handleSwitchToOtp = async (username) => {
        setInnerError('');
        if (!username) {
            setInnerError('جهت ورود با OTP، لطفاً نام کاربری را در فیلد مربوطه بنویسید.');
            return;
        }
        setTempUsername(username);
        try {
            await sendOtp(username);
            setView('otp');
        } catch (err) {
            setInnerError(err.message || 'خطا در ارسال کد یکبار مصرف');
        }
    };

    // تایید کد OTP
    const handleVerifyOtp = async (code) => {
        setInnerError('');
        try {
            const response = await verifyOtp(code);
            if (response.token) {
                onAuthComplete(response);
            }
        } catch (err) {
            throw err;
        }
    };

    // ارسال مجدد کد OTP
    const handleResendOtp = async (username) => {
        await sendOtp(username);
    };

    // تغییر رمز عبور موفق
    const handleChangePassword = async ({ username, oldPassword, newPassword }) => {
        try {
            await changePassword(username, oldPassword, newPassword);
            // پس از ثبت موفقیت‌آمیز رمز جدید، مجددا به صفحه لاگین هدایتش می‌کنیم تا با رمز جدید وارد شود
            setView('login');
            alert('رمز عبور شما با موفقیت تغییر کرد. لطفاً با رمز عبور جدید وارد شوید.');
        } catch (err) {
            throw err;
        }
    };

    return (
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-xs">
            {innerError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                    {innerError}
                </div>
            )}

            {view === 'login' && (
                <LoginForm
                    onLoginSuccess={handleLoginSubmit}
                    onSwitchToOtp={handleSwitchToOtp}
                    loading={loading}
                />
            )}

            {view === 'otp' && (
                <OtpForm
                    username={tempUsername}
                    onVerify={handleVerifyOtp}
                    onResendOtp={handleResendOtp}
                    onBackToLogin={() => setView('login')}
                    loading={loading}
                />
            )}

            {view === 'change-pass' && (
                <ChangePassForm
                    username={tempUsername}
                    onChangeSuccess={handleChangePassword}
                    onCancel={() => setView('login')}
                    loading={loading}
                />
            )}
        </div>
    );
};
