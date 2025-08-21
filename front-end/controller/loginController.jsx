import API from '../common/axiosInstance';
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    token: null,
    rehydrated: false,
}
export const adminlogin = createAsyncThunk('auth/adminlogin',
    async(formdata)=>{
        try{
            const response = await API.post("/admin/login", formdata, {
            withCredentials: true
            });
            const {token, user} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        }catch(error){
            console.error("Error logging in admin:", error);
        }
        
    }
);

export const baseCommanderLogin = createAsyncThunk('auth/baseCommanderLogin',
    async(formdata)=>{
        try{
            const response = await API.post("/base-commander/login", formdata, {
            withCredentials: true
            });
            const {token, user} = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        }catch(error){
            console.error("Error logging in admin:", error);
        }
        
    }
);

const authslice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        loadUserFromStorage: (state) => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            state.isAuthenticated = true;
            state.token = token;
            state.user = JSON.parse(user);
        }
        state.rehydrated = true;
    },
    },
    extraReducers: (builder) =>{
        builder
            .addCase(adminlogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(adminlogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;

            })
            .addCase(adminlogin.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(baseCommanderLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(baseCommanderLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(baseCommanderLogin.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    }
})


export const {loadUserFromStorage} = authslice.actions;
export default authslice.reducer;