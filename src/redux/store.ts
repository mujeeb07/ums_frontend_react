import { configureStore } from "@reduxjs/toolkit";
import { adminReducer} from "../features/admin/adminSlice";
import { userReducer } from "../features/users/userSlice";
import authReducer from "../features/auth/authSlice";


export const store = configureStore({
    reducer: {
        admin: adminReducer,
        user: userReducer,
        auth: authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 