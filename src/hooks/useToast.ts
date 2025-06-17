import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { addToast } from '../store/slices/toastSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  const toast = {
    success: useCallback((message: string, duration: number=5000) => {
      // Use setTimeout to defer the dispatch until after render
      setTimeout(() => {
        dispatch(addToast({ message, type: 'success', duration }));
      }, 0);
    }, [dispatch]),
    
    error: useCallback((message: string, duration?: number) => {
      setTimeout(() => {
        dispatch(addToast({ message, type: 'error', duration }));
      }, 0);
    }, [dispatch]),
    
    warning: useCallback((message: string, duration?: number) => {
      setTimeout(() => {
        dispatch(addToast({ message, type: 'warning', duration }));
      }, 0);
    }, [dispatch]),
    
    info: useCallback((message: string, duration?: number) => {
      setTimeout(() => {
        dispatch(addToast({ message, type: 'info', duration }));
      }, 0);
    }, [dispatch]),
  };

  return toast;
};