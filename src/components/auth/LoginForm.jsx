import React, {useState} from 'react';
import {Input} from '../common/Input';
import {Button} from '../common/Button';
import {FiUser, FiLock} from 'react-icons/fi';
import logoRobotMarket from '../../assets/images/logo-RobotMarket.png';

export const LoginForm = ({onLoginSuccess, onSwitchToOtp, loading}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('پر کردن تمامی فیلدها الزامی است');
            return;
        }
        setError('');

        setCooldown(true);
        setTimeout(() => setCooldown(false), 2000);

        try {
            await onLoginSuccess({username, password});
        } catch (err) {
            setError(err.message || 'نام کاربری یا رمز عبور اشتباه است');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex justify-center mb-4">
                <img
                    src={logoRobotMarket}
                    alt="Robot Market"
                    className="h-20 w-auto object-contain"
                />
            </div>

            <h2 className="text-xl font-bold text-center text-primary mb-6">
                ورود به پنل ربات مارکت
            </h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                    {error}
                </div>
            )}

            <Input
                label="نام کاربری"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="نام کاربری را وارد کنید"
                icon={FiUser}
                disabled={loading}
            />

            <Input
                label="رمز عبور"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور را وارد کنید"
                icon={FiLock}
                disabled={loading}
            />

            <div className="flex justify-between items-center text-xs mb-6">
                <button
                    type="button"
                    onClick={() => onSwitchToOtp(username)}
                    className="text-info hover:underline cursor-pointer"
                >
                    ورود با کد یکبار مصرف (OTP)
                </button>
            </div>

            <Button type="submit" loading={loading} cooldown={cooldown}>
                {cooldown ? 'کمی صبر کنید...' : 'ورود'}
            </Button>
        </form>
    );
};
