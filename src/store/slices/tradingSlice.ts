import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { Order, Position } from '../../graphql/trade/types';

// export interface Position{
//     tradingSymbol:string;
//     netQuantity:string;
//     exchange:string;
//     token:string;
//     [key:string]:any;
// }

// export interface Order{
//     tysm:string;
//     status:string;
//     reporttype:string;
//     [key:string]:any;
// }

export interface TradingState{
    positions:Position[];
    orders:Order[];
    loading:boolean;
    error:string | null;
}

const initialState:TradingState={
    positions:[],
    orders:[],
    loading:false,
    error:  null,
}


const tradingSlice=createSlice({
    name:'trading',
    initialState,
    reducers:{
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setPositions: (state, action: PayloadAction<Position[]>) => {
            state.positions = action.payload;
        },
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        addOrder:(state,action:PayloadAction<Order>)=>{
            const existingIndex=state.orders.findIndex(order=>order.symbol===action.payload.symbol)
            if(existingIndex >=0) state.orders[existingIndex]=action.payload;
            else state.orders.push(action.payload);
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearTradingData: (state) => {
            state.positions = [];
            state.orders = [];
            state.error = null;
        },
    }
})

export const {setLoading,setPositions,setOrders,addOrder,setError,clearTradingData}=tradingSlice.actions;
export default tradingSlice.reducer;