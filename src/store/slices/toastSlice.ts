import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }
  

 
  
  interface ToastState {
    toasts: Toast[];
  }
  
  const initialState: ToastState = {
    toasts: [],
  };
  
  const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
      addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
        const toast: Toast = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          ...action.payload,
        };
        state.toasts.push(toast);
      },
      removeToast: (state, action: PayloadAction<string>) => {
        state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
      },
      clearAllToasts: (state) => {
        state.toasts = [];
      },
    },
  });
  
  export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
  export default toastSlice.reducer;