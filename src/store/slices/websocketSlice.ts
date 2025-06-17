import {createSlice , PayloadAction} from '@reduxjs/toolkit'
import { TradingWebSocket,TickerData } from '../../websocket/websocket'

interface WebSocketState{
    instance:TradingWebSocket | null;
    isConnected:boolean;
    tickerData:{[key:string]:TickerData};
    error:string |null;
    reconnectAttempts:number;
}

const initialState:WebSocketState={
    instance:null,
    isConnected:false,
    tickerData:{},
    error:null,
    reconnectAttempts:0,
}

const websocketSlice=createSlice({
    name:'websocket',
    initialState,
    reducers:{
        setInstance:(state,action:PayloadAction<TradingWebSocket>)=>{
            state.instance=action.payload;
        },
        setConnected:(state,action:PayloadAction<boolean>)=>{
            state.isConnected=action.payload;
            if(action.payload){
                state.error=null;
                state.reconnectAttempts=0;
            }
        },
        updateTickerData:(state,action:PayloadAction<TickerData>)=>{          
            state.tickerData[action.payload.tk]={
                ...state.tickerData[action.payload.tk],
                ...action.payload,
            }
        },
        setError:(state,action:PayloadAction<string>)=>{
            state.error=action.payload;
        },
        setReconnectAttempts: (state, action: PayloadAction<number>) => {
            state.reconnectAttempts = action.payload;
        },
        clearTickerData: (state) => {
            state.tickerData = {};
        },
        disconnect:(state)=>{
            state.isConnected=false;
            state.tickerData={}
            state.error=null;
            state.reconnectAttempts=0;
        }
    }

})

export const {setInstance,setConnected,updateTickerData,setError,setReconnectAttempts,clearTickerData,disconnect,}=websocketSlice.actions;
export default websocketSlice.reducer