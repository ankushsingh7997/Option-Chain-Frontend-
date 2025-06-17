import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import websocketReducer from './slices/websocketSlice';
import optionChainReducer from './slices/optionChainSlice';
import tradingReducer from './slices/tradingSlice';
import brokerReducer from './slices/brokerSlice';
import userReducer from "./slices/userSlice"
import toastReducer from "./slices/toastSlice"
import { optionChainListenerMiddleware } from './middleware/OptionListener';

export const store = configureStore({
  reducer: {
    websocket: websocketReducer,
    optionChain: optionChainReducer,
    trading: tradingReducer,
    broker: brokerReducer,
    user:userReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['websocket/setInstance'],
        ignoredPaths: ['websocket.instance'],
      },
    }).prepend(optionChainListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;