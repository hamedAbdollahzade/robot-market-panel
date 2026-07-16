import React, { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FiMessageSquare } from 'react-icons/fi';

export const OtpForm = ({ username, onVerify, onResendOtp, onBackToLogin, loading }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) {
            setError('کد تایید را وارد کنید');
            return;
        }
        setError('');
        try {
            await onVerify(code);
        } catch (err) {
            setError(err.message || 'کد وارد شده معتبر نیست');
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        try {
            await onResendOtp(username);
            setTimer(60);
        } catch (err) {
            setError('خطا در ارسال مجدد کد');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-xl font-bold text-center text-primary mb-6">کد تایید یکبار مصرف</h2>

            <p className="text-xs text-slate-500 text-center mb-6 leading-6">
                کد ارسال شده به نام کاربری <span className="font-bold text-primary">{username}</span> را وارد کنید.
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                    {error}
                </div>
            )}

            <Input
                label="کد تایید ۵ رقمی"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="— — — — —"
                icon={FiMessageSquare}
                disabled={loading}
            />

            <div className="flex justify-between items-center text-xs mb-6">
                <button
                    type="button"
                    disabled={timer > 0}
                    onClick={handleResend}
                    className={`font-semibold cursor-pointer ${timer > 0 ? 'text-slate-400' : 'text-info hover:underline'}`}
                >
                    {timer > 0 ? `ارسال مجدد کد (${timer} ثانیه)` : 'ارسال مجدد کد'}
                </button>
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="text-slate-400 hover:text-slate-600"
                >
                    بازگشت به لاگین
                </button>
            </div>

            <Button type="submit" loading={loading}>
                تایید و ورود
            </Button>
        </form>
    );
};
