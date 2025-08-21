import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        token:localStorage.getItem('token') || null,
        status : 'idle',// idle | loading | succeeded | failed
        error:null
    },
    reducers:{
        setAuthTokens: (state,actions)=>{
            const {user,token} = actions.payload;
            state.user= user;
            state.token = token;

            localStorage.setItem('token',token);
        },
        clearAuth : (state,actions)=>{
            state.user= null;
            state.token=null;
            state.status='idle';
            
            localStorage.removeItem('token');
        },
        setUser : (state,action)=>{
            state.user =action.payload.user;
            state.status='succeded';
        }
    }
});

export const {setAuthTokens,clearAuth,setUser} = authSlice.actions;
export default authSlice.reducer;