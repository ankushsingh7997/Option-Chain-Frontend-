import { useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { GET_ALL_BROKERS } from '../graphql/broker/broker';
import { GetAllBrokersResponse } from '../graphql/broker/types';
import { setBrokerData, setBrokerLoading, setBrokerError, clearBrokerData } from '../store/slices/brokerSlice';
import { selectBrokerData, selectBrokerError, selectBrokerLoading } from '../store/selectors';

interface UseBrokerDataOptions {
  fetchPolicy?: 'immediate' | 'lazy';
  autoFetch?: boolean;
  onSuccess?: (brokerData: any) => void;
  onError?: (error: string) => void;
}

export const useBrokerData = (options: UseBrokerDataOptions = {}) => {
  const {
    fetchPolicy = 'immediate',
    autoFetch = true,
    onSuccess,
    onError
  } = options;

  const dispatch = useDispatch();
  const brokerData = useSelector(selectBrokerData);
  const isLoading = useSelector(selectBrokerLoading);
  const error = useSelector(selectBrokerError);

  const handleBrokerResponse = useCallback((data: GetAllBrokersResponse) => {
    
    if (data?.getAllBrokers?.status && data.getAllBrokers.data?.length > 0) {
      const broker = data.getAllBrokers.data[0];
      
      const brokerPayload = {
        accessToken: broker.accessToken,
        actid: broker.actid,
        broker: broker.broker,
        lastLoginAt: broker.lastLoginAt,
        loginStatus: broker.loginStatus
      };
      dispatch(setBrokerData(brokerPayload));
      onSuccess?.(brokerPayload);
    } else if (data?.getAllBrokers?.status === false) {
      const errorMessage = data.getAllBrokers.message || 'Failed to fetch brokers';
      console.log('🔴 Broker API returned error:', errorMessage);
      dispatch(setBrokerError(errorMessage));
      onError?.(errorMessage);
    }
    
    dispatch(setBrokerLoading(false));
  }, [dispatch, onSuccess, onError]);

  const handleBrokerError = useCallback((error: any) => {
    const errorMessage = error.message || 'Error fetching broker data';
    console.error('🔴 handleBrokerError called:', error);
    dispatch(setBrokerError(errorMessage));
    dispatch(setBrokerLoading(false));
    onError?.(errorMessage);
  }, [dispatch, onError]);


  const { loading: immediateLoading, error: immediateError, refetch } = useQuery<GetAllBrokersResponse>(
    GET_ALL_BROKERS,
    {
      skip: fetchPolicy !== 'immediate',
      onCompleted: handleBrokerResponse,
      onError: handleBrokerError,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );

  const [getBrokers, { loading: lazyLoading, error: lazyError }] = useLazyQuery<GetAllBrokersResponse>(
    GET_ALL_BROKERS,
    {
      onCompleted: handleBrokerResponse,
      onError: handleBrokerError,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network'
    }
  );

  const fetchBrokers = useCallback(async () => {
    dispatch(setBrokerLoading(true));
    
    try {
      let result;
      if (fetchPolicy === 'immediate') {
        result = await refetch();
      } else {
        result = await getBrokers();
      }
      
      // Manual fallback processing if onCompleted doesn't fire
      if (result?.data) {
        const data = result.data;
        
        if (data?.getAllBrokers?.status && data.getAllBrokers.data?.length > 0) {
          const broker = data.getAllBrokers.data[0];
          
          const brokerPayload = {
            accessToken: broker.accessToken,
            actid: broker.actid,
            broker: broker.broker,
            lastLoginAt: broker.lastLoginAt,
            loginStatus: broker.loginStatus
          };
          dispatch(setBrokerData(brokerPayload));
          onSuccess?.(brokerPayload);
        } else if (data?.getAllBrokers?.status === false) {
          const errorMessage = data.getAllBrokers.message || 'Failed to fetch brokers';
          console.log('🟡 Broker API returned error (fallback):', errorMessage);
          dispatch(setBrokerError(errorMessage));
          onError?.(errorMessage);
        }
      }
      

      dispatch(setBrokerLoading(false));
      
    } catch (error) {
      dispatch(setBrokerError( 'Error fetching broker data'));
      dispatch(setBrokerLoading(false));
    }
  }, [dispatch, fetchPolicy, refetch, getBrokers, onSuccess, onError]);

  const triggerLazyFetch = useCallback(() => {
    if (fetchPolicy === 'lazy' && autoFetch) {
      dispatch(setBrokerLoading(true));
      getBrokers();
    }
  }, [fetchPolicy, autoFetch, dispatch, getBrokers]);

  // Update broker data manually (useful for when broker is added/updated)
  const updateBrokerData = useCallback((newBrokerData: any) => {
    dispatch(setBrokerData({
      accessToken: newBrokerData.accessToken,
      actid: newBrokerData.actid,
      broker: newBrokerData.broker,
      lastLoginAt: newBrokerData.lastLoginAt,
      loginStatus: newBrokerData.loginStatus
    }));
  }, [dispatch]);

  // Clear broker data using existing slice action
  const clearBroker = useCallback(() => {
    dispatch(clearBrokerData());
  }, [dispatch]);

  const isQueryLoading = fetchPolicy === 'immediate' ? immediateLoading : lazyLoading;
  const queryError = fetchPolicy === 'immediate' ? immediateError : lazyError;

  return {
    // Data
    brokerData,
    isLoading: isLoading || isQueryLoading,
    error: error || queryError?.message,
    
    // Methods
    fetchBrokers,
    triggerLazyFetch,
    updateBrokerData,
    clearBroker,
    refetch: fetchPolicy === 'immediate' ? refetch : getBrokers,
    
    // Status
    hasData: !!brokerData,
    hasError: !!(error || queryError)
  };
};