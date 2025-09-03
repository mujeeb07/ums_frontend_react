import { createSlice } from "@reduxjs/toolkit";

interface AuthState  {
    isAuthenticated: boolean;
    username?: string
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("accessToken")
}

const authSlice = createSlice({
    name: "auth",
    initialState:initialState,
    reducers: {
        setUserAuth: (state, action) => {
            state.isAuthenticated = true;
            localStorage.setItem("accessToken", action.payload);
        },
        setUserLogout: (state) => {
            // console.log("SETUZAS,,,,,,,,,,,,,,,,,,,,,,,")
            localStorage.removeItem("accessToken");
            state.isAuthenticated = false
        }
    },
});
 
export const { setUserAuth, setUserLogout} = authSlice.actions;
export default authSlice.reducer;