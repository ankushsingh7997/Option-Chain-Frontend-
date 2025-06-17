import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BrokerData {
    accessToken: string | null;
    actid: string;
    broker: string;
    lastLoginAt: string;
    loginStatus: boolean;
    userId?: string; 
}

export interface BrokerState {
    brokerData: BrokerData | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: BrokerState = {
    brokerData: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
};

const brokerSlice = createSlice({
    name: 'broker',
    initialState,
    reducers: {
        setBrokerData: (state, action: PayloadAction<BrokerData>) => {
            state.brokerData = action.payload;
            state.isLoggedIn = action.payload.loginStatus;
            state.error = null;
        },
        setBrokerLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setBrokerError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        clearBrokerData: (state) => {
            state.brokerData = null;
            state.isLoggedIn = false;
            state.error = null;
            state.isLoading = false;
        }
    }
});

export const { 
    setBrokerData, 
    setBrokerLoading, 
    setBrokerError, 
    clearBrokerData 
} = brokerSlice.actions;

export default brokerSlice.reducer;

// Selectors
