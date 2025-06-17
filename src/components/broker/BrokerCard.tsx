import React, { useEffect, useState } from 'react';
import { Activity, Clock, Shield, Trash2, User } from 'lucide-react';
import { useMutation } from '@apollo/client';
import Button from '../ui/Button/Button';
import StatusIndicator from './StatusIndicator';
import InfoCard from './InfoCard';
import { BrokerData } from '../../store/slices/brokerSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { BROKER_LOGIN_MUTATION, DELETE_BROKER_MUTATION } from '../../graphql/broker/broker';
import { useToast } from '../../hooks/useToast';
import { clearAllBrokerData } from '../../utils/utils';
import { extractErrorMessage } from '../../apollo/error';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

interface BrokerCardProps {
  brokerData: BrokerData;
  onRefresh: () => void;
}

const BrokerCard: React.FC<BrokerCardProps> = ({ brokerData, onRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useDispatch<AppDispatch>();


  const toast = useToast();

  // Broker Login Mutation
  const [brokerLogin] = useMutation(BROKER_LOGIN_MUTATION, {
    onCompleted: (data) => {
      const response = data.loginBroker;
      const requestToken = new URLSearchParams(location.search).get('requestToken');

      if (requestToken) {
        if (response.status && response.accessToken) {
          toast.success(response.message || 'Login successful');
          window.history.replaceState({}, document.title, window.location.pathname);
          onRefresh();
        } else {
          toast.error(response.message || 'Login failed');
        }
      } else {
        if (!response.status && response.redirect_uri && response.message === 'redirect') {
          window.location.href = response.redirect_uri;
        } else {
          toast.error('Login initiation failed');
        }
      }

      setIsLoggingIn(false);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Login failed'));
      setIsLoggingIn(false);
    }
  });

  // Delete Broker Mutation
  const [deleteBroker] = useMutation(DELETE_BROKER_MUTATION, {
    onCompleted: (data) => {
      const { status, message } = data.removeBroker;
      if (status) {
        toast.success(message || 'Broker deleted');
        dispatch(clearAllBrokerData());
        onRefresh();
      } else {
        toast.error(message || 'Failed to delete broker');
      }
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Failed to delete broker'));
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  });

  // On mount: handle login with request token
  useEffect(() => {
    const requestToken = new URLSearchParams(location.search).get('requestToken');
    if (requestToken && !brokerData?.accessToken) {
      handleLoginWithRequestToken(requestToken);
    }
  }, [location.search, brokerData?.accessToken]);

  const handleInitialLogin = () => {
    setIsLoggingIn(true);
    brokerLogin({
      variables: {
        input: {
          actid: brokerData?.actid
        }
      }
    });
  };

  const handleLoginWithRequestToken = (requestToken: string) => {
    setIsLoggingIn(true);
    brokerLogin({
      variables: {
        input: {
          actid: brokerData?.actid,
          request_token: requestToken
        }
      }
    });
  };

  const handleDeleteBroker = () => {
    setIsDeleting(true);
    deleteBroker({
      variables: {
        input: {
          actid: brokerData?.actid
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-background-3 backdrop-blur-lg border border-light-gray w-[500px] rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-sec-blue rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-20 font-ibm font-bold text-white capitalize">
                {brokerData?.broker}
              </h2>
              <p className="text-[#9A9A9A] font-montserrat text-14">
                Account ID: {brokerData?.actid}
              </p>
            </div>
          </div>
          <StatusIndicator isActive={brokerData?.loginStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={Activity} label="Status" value={brokerData?.loginStatus ? 'Active' : 'Inactive'} />
          <InfoCard icon={Clock} label="Last Login" value={brokerData?.lastLoginAt || 'Never'} />
        </div>

        <div className="mt-6 bg-elemental-gray rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-sec-blue" />
              <div>
                <p className="text-[#9A9A9A] font-montserrat text-12">Access Token</p>
                <p className="text-white font-ibm font-medium">
                  {brokerData?.accessToken ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>
            {brokerData?.accessToken && <div className="w-3 h-3 bg-green-400 rounded-full" />}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-light-gray">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-montserrat text-14 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Broker</span>
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-[#9A9A9A] font-montserrat text-14">
                Are you sure you want to delete this broker? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteBroker}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-12 font-montserrat rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-12 font-montserrat rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          text="Refresh"
          variant="secondary"
          onClick={onRefresh}
          className="flex-1 h-12 text-sec-blue border border-sec-blue hover:bg-sec-blue hover:text-white rounded-lg font-ibm font-medium transition-colors"
        />
        {!brokerData?.loginStatus ? (
          <Button
            text={isLoggingIn ? 'Logging in...' : 'Login'}
            variant="primary"
            disabled={isLoggingIn}
            onClick={handleInitialLogin}
            className="flex-1 h-12 text-white bg-sec-blue hover:bg-[#3f59d8] disabled:bg-[#4B4C51] disabled:cursor-not-allowed rounded-lg font-ibm font-medium transition-colors"
          />
        ) : (
          <Button
            text="Dashboard"
            variant="primary"
            disabled={!brokerData?.loginStatus}
            onClick={() => navigate('/dashboard')}
            className="flex-1 h-12 text-white bg-sec-blue hover:bg-[#3f59d8] disabled:bg-[#4B4C51] disabled:cursor-not-allowed rounded-lg font-ibm font-medium transition-colors"
          />
        )}
      </div>
    </div>
  );
};

export default BrokerCard;
