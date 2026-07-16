import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FiLock, FiCheck } from 'react-icons/fi';

export const ChangePassForm = ({ username, onChangeSuccess, onCancel, loading }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('پر کردن تمامی فیلدها الزامی است');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('تکرار رمز عبور جدید همخوانی ندارد');
            return;
        }
        if (newPassword.length < 6) {
            setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد');
            return;
        }
        setError('');

        // مکانیزم Cooldown برای دکمه ثبت تغییر رمز
        setCooldown(true);
        setTimeout(() => setCooldown(false), 2000);

        try {
            await onChangeSuccess({ username, oldPassword, newPassword });
        } catch (err) {
            setError(err.message || 'خطا در تغییر رمز عبور. لطفاً اطلاعات را بررسی کنید.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-xl font-bold text-center text-primary mb-2">تغییر رمز عبور اجباری</h2>
            <p className="text-xs text-slate-500 text-center mb-6 leading-6">
                به عنوان اولین ورود به سیستم، جهت حفظ امنیت پنل دستگاه، رمز عبور جدیدی تعریف کنید.
            </p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                    {error}
                </div>
            )}

            <Input
                label="رمز عبور فعلی"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="رمز عبور فعلی را وارد کنید"
                icon={FiLock}
                disabled={loading}
            />

            <Input
                label="رمز عبور جدید"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="رمز عبور جدید را وارد کنید"
                icon={FiLock}
                disabled={loading}
            />

            <Input
                label="تکرار رمز عبور جدید"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تکرار رمز عبور جدید را وارد کنید"
                icon={FiCheck}
                disabled={loading}
            />

            <div className="flex gap-3 mt-6">
                <Button type="submit" loading={loading} cooldown={cooldown} className="flex-1">
                    {cooldown ? 'کمی صبر کنید...' : 'ثبت رمز جدید'}
                </Button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors text-sm cursor-pointer disabled:opacity-50"
                >
                    انصراف
                </button>
            </div>
        </form>
    );
};
