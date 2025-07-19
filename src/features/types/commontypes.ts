export interface User {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    status: boolean;
    image: string
}

export interface adminState {
    users: User[];
    isLoading: boolean;
    error: string | null;
}

export interface userState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isDarkTheme: boolean;
}

