// constants.ts

import moment, { Moment, MomentInput } from "moment";
import { getExpiry, InstrumentCode } from "./option";
import { MenuProps } from "antd";

export const WEBSOCKET_CONFIG = {
    RECONNECT_DELAY: 5000,
    MAX_RECONNECT_ATTEMPTS: 5,
    UPDATE_DELAY: 750,
    HEARTBEAT_INTERVAL: 30000,
    CONNECTION_TIMEOUT: 10000,
  } as const;
  
  export const WEBSOCKET_EVENTS = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    CONNECTION_DROPPED: 'connectionDropped',
    AUTHENTICATED: 'authenticated',
    TICKER_UPDATE: 'tickerUpdate',
    ORDER_UPDATE: 'orderUpdate',
    ORDER_ALERT: 'orderAlert',
    NEW_TOKEN_SUBSCRIPTION: 'newTokenSubscription',
    DATA_FETCH_REQUIRED: 'dataFetchRequired',
    ERROR: 'error',
    RECONNECTING: 'reconnecting',
    MAX_RECONNECT_ATTEMPTS_REACHED: 'maxReconnectAttemptsReached',
    MESSAGE: 'message'
  } as const;
  
  export const ORDER_STATUS = {
    OPEN: 'OPEN',
    COMPLETE: 'COMPLETE',
    REJECTED: 'REJECTED',
    TRIGGER_PENDING: 'TRIGGER_PENDING',
    CANCELED: 'CANCELED'
  } as const;
  
  export const ORDER_REPORT_TYPES = {
    NEW: 'New',
    FILL: 'Fill',
    REJECTED: 'Rejected',
    TRIGGER_PENDING: 'TriggerPending',
    CANCELED: 'Canceled',
    REPLACED: 'Replaced'
  } as const;
  
  export const EXCHANGE_CODES = {
    NSE: 'NSE',
    NFO: 'NFO',
    BSE: 'BSE',
    MCX: 'MCX'
  } as const;
  
  export const INDEX_TOKENS = {
    NIFTY: '26000',
    BANKNIFTY: '26009',
    FINNIFTY: '26037',
    MIDCPNIFTY: '26074'
  } as const;
  
  export const DEFAULT_INDEX_SUBSCRIPTION = 'NSE|26000#NSE|26009#NSE|26074#NSE|26037';


  type strikeDifferenctType={
    [key:string]:number
  }
  export const STRIKE_DIFFERENCES:strikeDifferenctType = {
    'NIFTY': 50,
    'BANKNIFTY': 100,
    'FINNIFTY': 50,
    'MIDCPNIFTY': 25
  } as const;
  
  export const INDEX_TICKER_MAP :{[keys:string]:string}= {
    '26000': 'NIFTY',
    '26009': 'BANKNIFTY', 
    '26037': 'FINNIFTY',
    '26074': 'MIDCPNIFTY'
  } as const;
  
  export const OPTION_TYPES = {
    CALL: 'CE',
    PUT: 'PE'
  } as const;
  
  export const TRANSACTION_TYPES = {
    BUY: 'B',
    SELL: 'S'
  } as const;
  
  export const PRODUCT_TYPES = {
    MIS: 'MIS',
    NRML: 'NRML',
    CNC: 'CNC'
  } as const;
  
  export const PRICE_TYPES = {
    MARKET: 'MKT',
    LIMIT: 'LMT',
    STOP_LOSS: 'SL',
    STOP_LOSS_MARKET: 'SL-M'
  } as const;
  
  // Helper functions
  export const createTokenString = (tokens: string[]): string => {
    return tokens.join('#');
  };
  
  export const parseTokenFromSymbol = (tradingSymbol: string): {
    strike: string;
    optionType: 'CE' | 'PE';
  } => {
    const length = tradingSymbol.length;
    const strike = tradingSymbol.substring(length - 5, length);
    const optionType = tradingSymbol.substring(length - 8, length).includes('P') ? 'PE' : 'CE';
    
    return { strike, optionType };
  };
  
  export const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`;
  };
  
  
  export const getNearestStrikePrice = (currentPrice: number, strikeDifference: number): number => {
    return Math.round(currentPrice / strikeDifference) * strikeDifference;
  };
  
  // export const getNearestExpiry = (expiryDate: string): string | null => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  
  //   const [day, month, year] = expiryDate.split('-').map(Number);
  //   const date = new Date(year, month - 1, day);
  //   date.setHours(0, 0, 0, 0);
  
  //   return date >= today ? formatDate(date) : null;
  // };
  
  export const getTradingSymbol = (
    index: string, 
    currentIndexValue: number, 
    expiryDate: string,
    optionType: 'P' | 'C' = 'P'
  ): string => {
    const nearestExpiry = expiryDate
    const strikeDiff = STRIKE_DIFFERENCES[index as keyof typeof STRIKE_DIFFERENCES];
    const nearestStrike = getNearestStrikePrice(currentIndexValue, strikeDiff);
    
    return `${index}${nearestExpiry}${optionType}${nearestStrike}`;
  };
  
  export const createFullTokenString = (optionData: any[]): string => {
    const tokens = optionData?.map(item => `${item.exchange}|${item.token}`) || [];
    return tokens.join('#');
  };
  
  export const isValidOrderStatus = (status: string): boolean => {
    return Object.values(ORDER_STATUS).includes(status as any);
  };
  
  export const isValidReportType = (reportType: string): boolean => {
    return Object.values(ORDER_REPORT_TYPES).includes(reportType as any);
  };
  
  export const shouldTriggerOrderAlert = (reportType: string, status: string): boolean => {
    return (
      (reportType === ORDER_REPORT_TYPES.NEW && status !== ORDER_STATUS.OPEN) ||
      (reportType === ORDER_REPORT_TYPES.FILL && status === ORDER_STATUS.COMPLETE) ||
      reportType === ORDER_REPORT_TYPES.REJECTED ||
      reportType === ORDER_REPORT_TYPES.TRIGGER_PENDING ||
      reportType === ORDER_REPORT_TYPES.CANCELED ||
      (reportType === ORDER_REPORT_TYPES.REPLACED && status === ORDER_STATUS.TRIGGER_PENDING)
    );
  };


  const HOLIDAYS = new Set<string>([
    "2024-12-25",
    "2025-01-26",
    "2025-02-26",
    "2025-03-14",
    "2025-03-31",
    "2025-04-10",
    "2025-04-14",
    "2025-04-18",
    "2025-05-01",
    "2025-08-15",
    "2025-08-27",
    "2025-10-02",
    "2025-10-21",
    "2025-10-22",
    "2025-11-05",
    "2025-12-25"
  ]);
  
  export interface ExpiryDetails { 
    expiryType: "weekly" | "monthlyEnd";
    expiryDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }
  
  /**
   * Find the next valid expiry date, skipping weekends & holidays.
   *
   * @param details   Choices for weekly vs. month-end contracts.
   * @param todayIn   Optional “today” (string, Date, or moment). Defaults to now().
   * @returns         A moment object representing the next trading expiry.
   */
  export function getLatestExpiryDate(details: ExpiryDetails, todayIn?: MomentInput): Moment {
    const { expiryType, expiryDay } = details;
    const today = moment(todayIn).startOf('day');
    const candidate = today.clone();
    if (expiryType === "weekly") {
      const addDays = (7 + expiryDay - candidate.day()) % 7;
      candidate.add(addDays, "days");
    } else {
      candidate.endOf("month");
      while (candidate.day() !== expiryDay) {
        candidate.subtract(1, "days");
      }
      if (candidate.isBefore(today, "day")) {
        candidate.add(1, "month").endOf("month");
        while (candidate.day() !== expiryDay) {
          candidate.subtract(1, "days");
        }
      }
    }
  
    // Move to previous working day if expiry falls on weekend/holiday
    while (
      candidate.day() === 0 || // Sunday
      candidate.day() === 6 || // Saturday
      HOLIDAYS.has(candidate.format("YYYY-MM-DD"))
    ) {
      candidate.subtract(1, "days");
    }
  
    return candidate;
    
  }


export const getExpiryItems = (selectedIndex:string,handleChange:(index:string,formattedDate:string)=>void): MenuProps['items'] => {
    if (!selectedIndex) return [];
    
    const expiryDetails = getExpiry(selectedIndex as InstrumentCode);
    const expiries: MenuProps['items'] = [];
    let currentDate = moment();

    for (let i = 0; i < 4; i++) {
      const expiryMoment = getLatestExpiryDate(expiryDetails, currentDate);
      const formattedDate = formatDate(expiryMoment.toDate());
      
      expiries.push({
        key: formattedDate,
        label: formattedDate,
        onClick: () => handleChange(selectedIndex,formattedDate)
      });

      
      if (expiryDetails.expiryType === "weekly") {
        currentDate = expiryMoment.clone().add(1, 'day');
      } else {
        currentDate = expiryMoment.clone().add(1, 'month');
      }
    }

    return expiries;
  };