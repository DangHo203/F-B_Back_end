interface User {
    user_id: number;
    fullName: string;
    email: string;
    password: string;
    image: string;  
}

interface LoginResponse {
    message: string;
    token?: string;
    status?: number;
    user?: {
        id: number;
        email: string;
        fullName: string;
        image: string
    };
}

interface OtpResponse {
    success: boolean;
    otp?: string;
    error?: any;
}

interface RegisterResponse {
    message: string;
    result?: any;
    status?: number;
}

export { User, LoginResponse, OtpResponse, RegisterResponse };