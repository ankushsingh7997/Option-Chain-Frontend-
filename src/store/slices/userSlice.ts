import {createSlice,PayloadAction} from "@reduxjs/toolkit";
 export interface UserData{
    name:string;
    email:string;
    number:string;
    loginStatus?:boolean;
 }

 interface UserState{
    userData:UserData | null
    isLoggedIn:boolean
 }

 const initialState: UserState={
    userData:null,
    isLoggedIn:true
 }

 const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUserData:(state,action:PayloadAction<UserData>)=>{
            state.userData=action.payload;
            state.isLoggedIn=action.payload.loginStatus as boolean
        },
        clearUserData:(state)=>{
            state.userData=null;
            state.isLoggedIn=false
        }
    }
 })


 export const {setUserData,clearUserData}=userSlice.actions;
 export default userSlice.reducer;