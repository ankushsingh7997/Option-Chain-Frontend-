import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import { OptionChainData,OptionObject } from '../../websocket/optionChainUtils'

interface OptionChainState {
    optionData: OptionChainData[];
    optionObject: OptionObject;
    tokens: string[];
    loading: boolean;
    error: string | null;
    selectedIndex: string ;
    currentPrice: number | null;
    expiryDate: string | null;
    lots:number;
}

// localStorage keys for initial state only
const STORAGE_KEYS = {
    SELECTED_INDEX: 'optionChain_selectedIndex',
    CURRENT_PRICE: 'optionChain_currentPrice',
    EXPIRY_DATE: 'optionChain_expiryDate'
} as const;

// Helper function to get initial state from localStorage
const getInitialState = (): OptionChainState => {
    try {
        const storedIndex = localStorage.getItem(STORAGE_KEYS.SELECTED_INDEX);
        const storedPrice = localStorage.getItem(STORAGE_KEYS.CURRENT_PRICE);
        const storedExpiry = localStorage.getItem(STORAGE_KEYS.EXPIRY_DATE);
        
        return {
            optionData: [],
            optionObject: {},
            tokens: [],
            loading: false,
            error: null,
            selectedIndex: storedIndex || "26000",
            currentPrice: storedPrice ? parseFloat(storedPrice) : 24700,
            expiryDate: storedExpiry,
            lots: 1
        };
    } catch (error) {
        console.warn('Error reading from localStorage:', error);
        return {
            optionData: [],
            optionObject: {},
            tokens: [],
            loading: false,
            error: null,
            selectedIndex: "26000",
            currentPrice: 24700,
            expiryDate: null,
            lots: 1
        };
    }
};

const initialState: OptionChainState = getInitialState();

const optionChainSlice = createSlice({
    name: 'optionChain',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setOptionChainData: (state, action: PayloadAction<{optionData: OptionChainData[]; optionObject: OptionObject; tokens: string[]}>) => {
            state.optionData = action.payload.optionData;
            state.optionObject = action.payload.optionObject;
            state.tokens = action.payload.tokens;
            state.error = null;
        },
        setLotSize: (state, action: PayloadAction<{lots: number}>) => {
            state.lots = action.payload.lots;
        },
        // Clean and simple - just update state, middleware handles the rest
        setOptionChainParams: (state, action: PayloadAction<{selectedIndex: string; currentPrice: number; expiryDate: string}>) => {
            state.selectedIndex = action.payload.selectedIndex;
            state.currentPrice = action.payload.currentPrice;
            state.expiryDate = action.payload.expiryDate;
        },
        updateOptionObject: (state, action: PayloadAction<OptionObject>) => {
            state.optionObject = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearOptionChain: (state) => {
            state.optionData = [];
            state.optionObject = {};
            state.tokens = [];
            state.error = null;
            state.currentPrice = null;
            state.expiryDate = null;
            state.lots = 1;
        }
    }
});

export const {
    setLoading,
    setOptionChainData,
    setLotSize,
    setOptionChainParams,
    updateOptionObject,
    setError,
    clearOptionChain
} = optionChainSlice.actions;

export default optionChainSlice.reducer;