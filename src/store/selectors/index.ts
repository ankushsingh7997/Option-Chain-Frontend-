import { createSelector, } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { BrokerState } from '../slices/brokerSlice';

// WebSocket selectors
export const selectWebSocketState = (state: RootState) => state.websocket;
export const selectIsConnected = (state: RootState) => state.websocket.isConnected;
export const selectTickerData = (state: RootState) => state.websocket.tickerData;
export const selectWebSocketError = (state: RootState) => state.websocket.error;

// Get specific ticker data
export const selectTickerByToken = (token: string) => 
  createSelector(
    [selectTickerData],
    (tickerData) => tickerData[token]
  );

// Option chain selectors
export const selectOptionChainState = (state: RootState) => state.optionChain;
export const selectOptionData = (state: RootState) => state.optionChain.optionData;
export const selectOptionObject = (state: RootState) => state.optionChain.optionObject;
export const selectOptionChainLoading = (state: RootState) => state.optionChain.loading;
export const selectOptionChainError = (state: RootState) => state.optionChain.error;

// Get specific option data by strike and option type
export const selectOptionByStrike = (strike: string, optionType: 'CE' | 'PE') =>
  createSelector(
    [selectOptionObject],
    (optionObject) => optionObject[strike]?.[optionType]
  );

// Trading selectors
export const selectTradingState = (state: RootState) => state.trading;
export const selectPositions = (state: RootState) => state.trading.positions;
export const selectOrders = (state: RootState) => state.trading.orders;
export const selectTradingLoading = (state: RootState) => state.trading.loading;

// Get positions with profit/loss calculation
export const selectPositionsWithPnL = createSelector(
  [selectPositions, selectTickerData],
  (positions, tickerData) => {
    return positions.map(position => {
      const currentPrice = tickerData[position.token]?.lp || 0;
  
      const pnl = calculatePnL(position, currentPrice);
      
      return {
        ...position,
        currentPrice,
        pnl,
      };
    });
  }
);



const calculatePnL = (position: any, currentPrice: number): number => {
  //  calculation for cnc is yet to be implement 
  if(position.netQuantity > 0 ){
    return position.realizedPnl + (currentPrice -position.dayBuyAveragePrice) * position.netQuantity
  } else return position.realizedPnl + (position.daySellAveragePrice - currentPrice) * position.netQuantity;
  
};

export const selectMTM = createSelector(
  [selectPositionsWithPnL],
  (positionsWithPnL) => {
    return Number(positionsWithPnL.reduce((total, position) => total + position.pnl, 0).toFixed(1));
  }
);

// Broker selectors
export const selectBrokerData = (state: { broker: BrokerState }) => state.broker.brokerData;
export const selectIsLoggedIn = (state: { broker: BrokerState }) => state.broker.isLoggedIn;
export const selectBrokerLoading = (state: { broker: BrokerState }) => state.broker.isLoading;
export const selectBrokerError = (state: { broker: BrokerState }) => state.broker.error;

// User selector
export const selectUserData=(state:RootState)=>state.user.userData;
export const userLoggedIn=(state:RootState)=>state.user.isLoggedIn;


export const selectMaxOI = createSelector(
  [selectOptionObject, selectTickerData],
  (optionObject, ticker) => {
    let maxCallOi = 0;
    let maxPutOi = 0;

    Object.keys(optionObject).forEach(strike => {
      const callToken = optionObject[strike]?.CE?.token;
      const putToken = optionObject[strike]?.PE?.token;

      if (callToken && ticker[callToken]) {
        const callOi = Number(ticker[callToken].oi ?? 0);
        maxCallOi = Math.max(maxCallOi, callOi);
      }

      if (putToken && ticker[putToken]) {
        const putOi = Number(ticker[putToken].oi ?? 0);
        maxPutOi = Math.max(maxPutOi, putOi);
      }
    });

    return { maxCallOi, maxPutOi };
  }
);


// Toast

export const selectToast=((state: RootState) => state.toast.toasts);