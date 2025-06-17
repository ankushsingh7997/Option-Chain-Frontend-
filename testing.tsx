// // store/selectors/index.ts
// import { createSelector } from '@reduxjs/toolkit';
// import { RootState } from '../index';

// // WebSocket selectors
// export const selectWebSocketState = (state: RootState) => state.websocket;
// export const selectIsConnected = (state: RootState) => state.websocket.isConnected;
// export const selectTickerData = (state: RootState) => state.websocket.tickerData;
// export const selectWebSocketError = (state: RootState) => state.websocket.error;

// // Get specific ticker data
// export const selectTickerByToken = (token: string) => 
//   createSelector(
//     [selectTickerData],
//     (tickerData) => tickerData[token]
//   );

// // Option chain selectors
// export const selectOptionChainState = (state: RootState) => state.optionChain;
// export const selectOptionData = (state: RootState) => state.optionChain.optionData;
// export const selectOptionObject = (state: RootState) => state.optionChain.optionObject;
// export const selectOptionChainLoading = (state: RootState) => state.optionChain.loading;
// export const selectOptionChainError = (state: RootState) => state.optionChain.error;

// // Get specific option data by strike and option type
// export const selectOptionByStrike = (strike: string, optionType: 'CE' | 'PE') =>
//   createSelector(
//     [selectOptionObject],
//     (optionObject) => optionObject[strike]?.[optionType]
//   );

// // Trading selectors
// export const selectTradingState = (state: RootState) => state.trading;
// export const selectPositions = (state: RootState) => state.trading.positions;
// export const selectOrders = (state: RootState) => state.trading.orders;
// export const selectTradingLoading = (state: RootState) => state.trading.loading;

// // Get positions with profit/loss calculation
// export const selectPositionsWithPnL = createSelector(
//   [selectPositions, selectTickerData],
//   (positions, tickerData) => {
//     return positions.map(position => {
//       const token = `${position.exchange}|${position.token}`;
//       const currentPrice = tickerData[token]?.lp || 0;
      
//       // Calculate P&L (you'll need to implement this based on your logic)
//       const pnl = calculatePnL(position, currentPrice);
      
//       return {
//         ...position,
//         currentPrice,
//         pnl,
//       };
//     });
//   }
// );

// // Helper function (implement based on your P&L logic)
// const calculatePnL = (position: any, currentPrice: number): number => {
//   // Implement your P&L calculation logic here
//   return 0;
// };

// // Broker selectors
// export const selectBrokerData = (state: RootState) => state.broker.brokerData;
// export const selectIsLoggedIn = (state: RootState) => state.broker.isLoggedIn;

// // App.tsx - Setup Redux Provider
// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from './store';
// import TradingApp from './components/TradingApp';

// function App() {
//   return (
//     <Provider store={store}>
//       <TradingApp />
//     </Provider>
//   );
// }

// export default App;

// // components/TradingApp.tsx - Main app component
// import React, { useEffect } from 'react';
// import { useTradingWebSocket } from '../hooks/useTradingWebSocket';
// import { InstrumentSelector } from './InstrumentSelector';
// import { OptionChainDisplay } from './OptionChainDisplay';
// import { PositionsDisplay } from './PositionsDisplay';
// import { WebSocketStatus } from './WebSocketStatus';

// const TradingApp: React.FC = () => {
//   const {
//     isConnected,
//     optionObject,
//     positions,
//     tickerData,
//     loginBroker,
//     fetchOptionChain,
//     optionChainLoading,
//     tradingLoading,
//   } = useTradingWebSocket();

//   // Auto-login for demo (replace with your login logic)
//   useEffect(() => {
//     const savedBrokerData = localStorage.getItem('brokerData');
//     if (savedBrokerData) {
//       const brokerData = JSON.parse(savedBrokerData);
//       loginBroker(brokerData);
//     }
//   }, [loginBroker]);

//   const handleLogin = (brokerData: any) => {
//     localStorage.setItem('brokerData', JSON.stringify(brokerData));
//     loginBroker(brokerData);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Trading Dashboard</h1>
      
//       <WebSocketStatus />
      
//       {!isConnected && (
//         <div className="mb-4">
//           <button
//             onClick={() => handleLogin({
//               accessToken: 'your-token',
//               actid: 'your-actid',
//             })}
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Login & Connect
//           </button>
//         </div>
//       )}

//       {isConnected && (
//         <>
//           <InstrumentSelector onSelectionChange={fetchOptionChain} />
          
//           {optionChainLoading && (
//             <div className="text-center py-4">Loading option chain...</div>
//           )}
          
//           <OptionChainDisplay />
          
//           {tradingLoading && (
//             <div className="text-center py-4">Loading positions...</div>
//           )}
          
//           <PositionsDisplay />
//         </>
//       )}
//     </div>
//   );
// };

// export default TradingApp;

// // components/WebSocketStatus.tsx
// import React from 'react';
// import { useAppSelector } from '../store';
// import { selectIsConnected, selectWebSocketError, selectWebSocketState } from '../store/selectors';

// export const WebSocketStatus: React.FC = () => {
//   const isConnected = useAppSelector(selectIsConnected);
//   const error = useAppSelector(selectWebSocketError);
//   const { reconnectAttempts } = useAppSelector(selectWebSocketState);

//   return (
//     <div className="mb-4 p-3 rounded-lg">
//       <div className={`flex items-center gap-2 ${
//         isConnected ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
//       }`}>
//         <div className={`w-3 h-3 rounded-full ${
//           isConnected ? 'bg-green-500' : 'bg-red-500'
//         }`} />
//         <span className="font-medium">
//           {isConnected ? 'Connected' : 'Disconnected'}
//         </span>
//         {reconnectAttempts > 0 && (
//           <span className="text-yellow-600">
//             (Reconnecting... {reconnectAttempts}/5)
//           </span>
//         )}
//       </div>
//       {error && (
//         <div className="text-red-600 text-sm mt-1">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// };

// // components/OptionChainDisplay.tsx
// import React from 'react';
// import { useAppSelector } from '../store';
// import { selectOptionObject, selectTickerData } from '../store/selectors';

// export const OptionChainDisplay: React.FC = () => {
//   const optionObject = useAppSelector(selectOptionObject);
//   const tickerData = useAppSelector(selectTickerData);

//   if (Object.keys(optionObject).length === 0) {
//     return <div>No option chain data available</div>;
//   }

//   return (
//     <div className="mb-6">
//       <h2 className="text-xl font





import React from 'react';

// Mock data from your JSON
const mockPositions = [
  {
    "__typename": "Position",
    "dayBuyAmount": 0,
    "dayBuyAveragePrice": 0,
    "dayBuyQuantity": 0,
    "daySellAmount": 19488,
    "daySellAveragePrice": 487.2,
    "daySellQuantity": 40,
    "exchange": "BFO",
    "lotSize": 20,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": 14738,
    "unrealizedMtom": 0,
    "token": "1140315",
    "symbol": "SENSEX17JUN25P80600",
    "tickSize": "0.05",
    "uploadPrice": "124.80"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 2710,
    "dayBuyAveragePrice": 67.75,
    "dayBuyQuantity": 40,
    "daySellAmount": 0,
    "daySellAveragePrice": 0,
    "daySellQuantity": 0,
    "exchange": "BFO",
    "lotSize": 20,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": 4526,
    "unrealizedMtom": 0,
    "token": "1141343",
    "symbol": "SENSEX17JUN25C82500",
    "tickSize": "0.05",
    "uploadPrice": "172.70"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 0,
    "dayBuyAveragePrice": 0,
    "dayBuyQuantity": 0,
    "daySellAmount": 1040,
    "daySellAveragePrice": 26,
    "daySellQuantity": 40,
    "exchange": "BFO",
    "lotSize": 20,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": -1420,
    "unrealizedMtom": 0,
    "token": "1140994",
    "symbol": "SENSEX17JUN25C83200",
    "tickSize": "0.05",
    "uploadPrice": "58.60"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 9822,
    "dayBuyAveragePrice": 491.1,
    "dayBuyQuantity": 20,
    "daySellAmount": 10621,
    "daySellAveragePrice": 531.05,
    "daySellQuantity": 20,
    "exchange": "BFO",
    "lotSize": 20,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "AH0296",
    "product": "M",
    "realizedPnl": 799,
    "unrealizedMtom": 0,
    "token": "1140063",
    "symbol": "SENSEX17JUN25C80800",
    "tickSize": "0.05",
    "uploadPrice": "0"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 8564,
    "dayBuyAveragePrice": 428.2,
    "dayBuyQuantity": 20,
    "daySellAmount": 11073,
    "daySellAveragePrice": 553.65,
    "daySellQuantity": 20,
    "exchange": "BFO",
    "lotSize": 20,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "AH0296",
    "product": "M",
    "realizedPnl": 2509,
    "unrealizedMtom": 0,
    "token": "1141105",
    "symbol": "SENSEX17JUN25P80800",
    "tickSize": "0.05",
    "uploadPrice": "0"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 0,
    "dayBuyAveragePrice": 0,
    "dayBuyQuantity": 0,
    "daySellAmount": 21360,
    "daySellAveragePrice": 142.4,
    "daySellQuantity": 150,
    "exchange": "NFO",
    "lotSize": 75,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": 14692.5,
    "unrealizedMtom": 0,
    "token": "50986",
    "symbol": "NIFTY19JUN25P24450",
    "tickSize": "0.05",
    "uploadPrice": "47.55"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 0,
    "dayBuyAveragePrice": 0,
    "dayBuyQuantity": 0,
    "daySellAmount": 3015,
    "daySellAveragePrice": 20.1,
    "daySellQuantity": 150,
    "exchange": "NFO",
    "lotSize": 75,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": -3367.5,
    "unrealizedMtom": 0,
    "token": "51023",
    "symbol": "NIFTY19JUN25C25300",
    "tickSize": "0.05",
    "uploadPrice": "41.40"
  },
  {
    "__typename": "Position",
    "dayBuyAmount": 6330,
    "dayBuyAveragePrice": 42.2,
    "dayBuyQuantity": 150,
    "daySellAmount": 0,
    "daySellAveragePrice": 0,
    "daySellQuantity": 0,
    "exchange": "NFO",
    "lotSize": 75,
    "mult": 1,
    "netQuantity": 0,
    "netUploadQuantity": "0.00",
    "userId": "UPLOAD",
    "product": "M",
    "realizedPnl": 7575,
    "unrealizedMtom": 0,
    "token": "51015",
    "symbol": "NIFTY19JUN25C25100",
    "tickSize": "0.05",
    "uploadPrice": "88.85"
  }
];

const POSITION_COLUMNS = [
  {
    title: "Instrument",
    css: "flex-1 text-left text-xs font-medium",
    key: "symbol"
  },
  {
    title: "Qty",
    css: "w-16 text-center text-xs font-medium",
    key: "quantity"
  },
  {
    title: "B/S",
    css: "w-12 text-center text-xs font-medium",
    key: "side"
  },
  {
    title: "AVG",
    css: "w-20 text-right text-xs font-medium",
    key: "avgPrice"
  },
  {
    title: "LTP",
    css: "w-20 text-right text-xs font-medium",
    key: "ltp"
  },
  {
    title: "Lot",
    css: "w-16 text-center text-xs font-medium",
    key: "lotSize"
  },
  {
    title: "P&L",
    css: "w-24 text-right text-xs font-medium",
    key: "pnl"
  }
];

const Positions = () => {
  // Helper function to determine buy/sell and average price
  const getPositionDetails = (position) => {
    const { dayBuyQuantity, daySellQuantity, dayBuyAveragePrice, daySellAveragePrice, realizedPnl, uploadPrice } = position;
    
    let side = '';
    let avgPrice = 0;
    let quantity = 0;
    
    if (dayBuyQuantity > 0 && daySellQuantity === 0) {
      side = 'B';
      avgPrice = dayBuyAveragePrice;
      quantity = dayBuyQuantity;
    } else if (daySellQuantity > 0 && dayBuyQuantity === 0) {
      side = 'S';
      avgPrice = daySellAveragePrice;
      quantity = daySellQuantity;
    } else if (dayBuyQuantity > 0 && daySellQuantity > 0) {
      side = 'B/S';
      avgPrice = (dayBuyAveragePrice + daySellAveragePrice) / 2;
      quantity = Math.abs(dayBuyQuantity - daySellQuantity);
    }
    
    return { side, avgPrice, quantity };
  };

  // Helper function to format currency
  const formatCurrency = (value) => {
    return `₹${value.toFixed(2)}`;
  };

  // Helper function to get P&L color
  const getPnlColor = (pnl) => {
    if (pnl > 0) return 'text-green-600';
    if (pnl < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Helper function to shorten symbol name
  const formatSymbol = (symbol) => {
    return symbol.length > 20 ? symbol.substring(0, 20) + '...' : symbol;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">Positions</h2>
        <div className="text-sm text-gray-600">
          Total: {mockPositions.length} positions
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex items-center p-3 bg-gray-100 border-b border-gray-200">
        {POSITION_COLUMNS.map((col, index) => (
          <div key={index} className={col.css}>
            <span className="text-gray-700 font-semibold">{col.title}</span>
          </div>
        ))}
      </div>

      {/* Position Rows */}
      <div className="flex-1 overflow-y-auto">
        {mockPositions.map((position, index) => {
          const { side, avgPrice, quantity } = getPositionDetails(position);
          
          return (
            <div 
              key={position.token} 
              className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              {/* Instrument */}
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-gray-900">
                  {formatSymbol(position.symbol)}
                </div>
                <div className="text-xs text-gray-500">
                  {position.exchange}
                </div>
              </div>

              {/* Quantity */}
              <div className="w-16 text-center">
                <span className="text-sm text-gray-900">{quantity}</span>
              </div>

              {/* Buy/Sell */}
              <div className="w-12 text-center">
                <span className={`text-xs font-medium px-1 py-0.5 rounded ${
                  side === 'B' ? 'bg-green-100 text-green-800' :
                  side === 'S' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {side}
                </span>
              </div>

              {/* Average Price */}
              <div className="w-20 text-right">
                <span className="text-sm text-gray-900">
                  {avgPrice > 0 ? formatCurrency(avgPrice) : '-'}
                </span>
              </div>

              {/* LTP (using uploadPrice as proxy) */}
              <div className="w-20 text-right">
                <span className="text-sm text-gray-900">
                  {position.uploadPrice && position.uploadPrice !== "0" 
                    ? formatCurrency(parseFloat(position.uploadPrice))
                    : '-'
                  }
                </span>
              </div>

              {/* Lot Size */}
              <div className="w-16 text-center">
                <span className="text-sm text-gray-900">{position.lotSize}</span>
              </div>

              {/* P&L */}
              <div className="w-24 text-right">
                <span className={`text-sm font-medium ${getPnlColor(position.realizedPnl)}`}>
                  {formatCurrency(position.realizedPnl)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Total P&L: 
        </div>
        <div className={`text-sm font-semibold ${
          getPnlColor(mockPositions.reduce((sum, pos) => sum + pos.realizedPnl, 0))
        }`}>
          {formatCurrency(mockPositions.reduce((sum, pos) => sum + pos.realizedPnl, 0))}
        </div>
      </div>
    </div>
  );
};

export default Positions;