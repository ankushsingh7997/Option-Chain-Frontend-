import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { removeToast } from '../../../store/slices/toastSlice';
import { RootState } from '../../../store';

const ToastContainer: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach(toast => {
      const duration = toast.duration || 5000;
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, duration);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getToastBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            bg-white border-l-4 ${getToastBorderColor(toast.type)} 
            rounded-lg shadow-lg p-4 min-w-80 max-w-96
            transform transition-all duration-300 ease-in-out
            animate-slide-in
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getToastIcon(toast.type)}
              <p className="text-sm font-medium text-gray-900 flex-1">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;