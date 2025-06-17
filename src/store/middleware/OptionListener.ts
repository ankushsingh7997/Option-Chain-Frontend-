import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setOptionChainParams } from "../slices/optionChainSlice";
import { websocketService } from "../../services/websocketService";

// Keeps track of the last used parameters to avoid redundant API calls
let previousParams: {
  selectedIndex: string;
  currentPrice: number;
  expiryDate: string;
} | null = null;

// Keys used for localStorage
const STORAGE_KEYS = {
  SELECTED_INDEX: 'optionChain_selectedIndex',
  CURRENT_PRICE: 'optionChain_currentPrice',
  EXPIRY_DATE: 'optionChain_expiryDate'
} as const;

// Retrieve option chain parameters from localStorage
const getStoredParams = () => {
  return {
    selectedIndex: localStorage.getItem(STORAGE_KEYS.SELECTED_INDEX),
    currentPrice: localStorage.getItem(STORAGE_KEYS.CURRENT_PRICE),
    expiryDate: localStorage.getItem(STORAGE_KEYS.EXPIRY_DATE)
  };
};

// Save option chain parameters to localStorage
const setStoredParams = (
  selectedIndex: string,
  currentPrice: number,
  expiryDate: string
) => {
  localStorage.setItem(STORAGE_KEYS.SELECTED_INDEX, selectedIndex);
  localStorage.setItem(STORAGE_KEYS.CURRENT_PRICE, currentPrice.toString());
  localStorage.setItem(STORAGE_KEYS.EXPIRY_DATE, expiryDate);
};

// Compare two sets of option chain parameters
const areParamsEqual = (
  params1: { selectedIndex: string; currentPrice: number; expiryDate: string },
  params2: { selectedIndex: string; currentPrice: number; expiryDate: string }
): boolean => {
  return (
    params1.selectedIndex === params2.selectedIndex &&
    params1.currentPrice === params2.currentPrice &&
    params1.expiryDate === params2.expiryDate
  );
};

// Initialize previousParams from localStorage
const initializePreviousParams = () => {
  const stored = getStoredParams();
  if (stored.selectedIndex && stored.currentPrice && stored.expiryDate) {
    previousParams = {
      selectedIndex: stored.selectedIndex,
      currentPrice: parseFloat(stored.currentPrice),
      expiryDate: stored.expiryDate
    };
    console.log('Initialized previous params from localStorage:', previousParams);
  }
};

initializePreviousParams();

// Create the listener middleware
export const optionChainListenerMiddleware = createListenerMiddleware();

optionChainListenerMiddleware.startListening({
  actionCreator: setOptionChainParams,
  effect: async (action, ) => {
    const { selectedIndex, currentPrice, expiryDate } = action.payload;
    const newParams = { selectedIndex, currentPrice, expiryDate };

    // Skip if parameters haven't changed
    if (previousParams && areParamsEqual(newParams, previousParams)) {
      return;
    }

    // Fetch new option chain data if connected
    if (websocketService.getConnectionStatus()) {
      await websocketService.fetchOptionChain(selectedIndex, currentPrice, expiryDate);
      previousParams = { ...newParams };
      setStoredParams(selectedIndex, currentPrice, expiryDate);
    }
  }
});
