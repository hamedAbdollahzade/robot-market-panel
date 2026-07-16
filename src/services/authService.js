const TOKEN_KEY = 'robot_market_token';
const USER_KEY = 'robot_market_user';
const OTP_KEY = 'robot_market_mock_otp';

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
    {
        username: 'admin',
        password: '123456',
        isFirstTime: false,
        mobile: '09120000000',
        role: 'admin',
    },
    {
        username: 'hamed',
        password: '111111',
        isFirstTime: true,
        mobile: '09123334455',
        role: 'manager',
    },
    {
        username: 'otpuser',
        password: '654321',
        isFirstTime: false,
        mobile: '09129998877',
        role: 'operator',
    },
];

const createToken = (username) => `mock-token-${username}-${Date.now()}`;

const persistAuth = (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            username: user.username,
            mobile: user.mobile,
            role: user.role,
        })
    );
};

const authService = {
    async login(username, password) {
        await delay();

        const user = mockUsers.find((item) => item.username === username);

        if (!user || user.password !== password) {
            throw new Error('نام کاربری یا رمز عبور اشتباه است');
        }

        if (user.isFirstTime) {
            return {
                success: true,
                isFirstTime: true,
                username: user.username,
                message: 'کاربر باید رمز عبور خود را تغییر دهد',
            };
        }

        const token = createToken(user.username);
        persistAuth(user, token);

        return {
            success: true,
            token,
            isFirstTime: false,
            user: {
                username: user.username,
                mobile: user.mobile,
                role: user.role,
            },
        };
    },

    async sendOtp(username) {
        await delay();

        const user = mockUsers.find((item) => item.username === username);

        if (!user) {
            throw new Error('کاربری با این نام کاربری پیدا نشد');
        }

        const code = '12345';
        localStorage.setItem(
            OTP_KEY,
            JSON.stringify({
                username,
                code,
                expiresAt: Date.now() + 2 * 60 * 1000,
            })
        );

        return {
            success: true,
            message: 'کد تایید ارسال شد',
            otp: code,
        };
    },

    async verifyOtp(code) {
        await delay();

        const otpDataRaw = localStorage.getItem(OTP_KEY);

        if (!otpDataRaw) {
            throw new Error('ابتدا کد تایید را درخواست کنید');
        }

        const otpData = JSON.parse(otpDataRaw);

        if (Date.now() > otpData.expiresAt) {
            localStorage.removeItem(OTP_KEY);
            throw new Error('کد تایید منقضی شده است');
        }

        if (otpData.code !== code) {
            throw new Error('کد تایید نادرست است');
        }

        const user = mockUsers.find((item) => item.username === otpData.username);

        if (!user) {
            throw new Error('کاربر یافت نشد');
        }

        const token = createToken(user.username);
        persistAuth(user, token);
        localStorage.removeItem(OTP_KEY);

        return {
            success: true,
            token,
            user: {
                username: user.username,
                mobile: user.mobile,
                role: user.role,
            },
        };
    },

    async changePassword(username, oldPassword, newPassword) {
        await delay();

        const user = mockUsers.find((item) => item.username === username);

        if (!user) {
            throw new Error('کاربر یافت نشد');
        }

        if (user.password !== oldPassword) {
            throw new Error('رمز عبور فعلی اشتباه است');
        }

        user.password = newPassword;
        user.isFirstTime = false;

        return {
            success: true,
            message: 'رمز عبور با موفقیت تغییر کرد',
        };
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(OTP_KEY);
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getCurrentUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
};

export default authService;
