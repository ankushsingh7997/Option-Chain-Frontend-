import _ from "lodash";
import { PlaceOrderInput } from "../graphql/trade/types";
import { OptionChainData } from "../websocket/optionChainUtils";
import { INDEX_TICKER_MAP, STRIKE_DIFFERENCES } from "./websocketConstants";
import { PositionWithPnL } from "../components/dashboard/trade/Portfolio";

interface ExpiryReturn {
    expiryType: "weekly" | "monthlyEnd";
    expiryDay: 0 | 1 | 2 | 3 | 4 | 5 | 6; 
  }
  
export type InstrumentCode = "26009" | "26000" | "26037" | "26074";
  
  const instrumentExpiryMap: Record<InstrumentCode, ExpiryReturn> = {
    "26000": { expiryType: "weekly", expiryDay: 4 },
    "26009": { expiryType: "monthlyEnd", expiryDay: 4 },
    "26037": { expiryType: "monthlyEnd", expiryDay: 4 },
    "26074": { expiryType: "monthlyEnd", expiryDay: 4 },
  };
  
  export const getExpiry = (instrument: InstrumentCode): ExpiryReturn => {
    return instrumentExpiryMap[instrument];
  };

  interface AtmStrike{
    strike:number;
    currentIndexVal:number;
    token:number;
  }

  export const isAtmStrike=({strike,currentIndexVal,token}:AtmStrike): boolean=>{
    const strikeDifference=STRIKE_DIFFERENCES[INDEX_TICKER_MAP[token]]
    const nearestMultiple=Math.round(currentIndexVal / strikeDifference) * strikeDifference
    return Math.abs(strike - nearestMultiple) < strikeDifference / 2
  }
  interface Itm{
    type:string;
    strike:number;
    currentIndexVal:number
  }
  export const isITM=({type,strike,currentIndexVal}:Itm):boolean=>{
    return (type==="CE" && strike < currentIndexVal || (type==="PE" &&strike > currentIndexVal ))
  }


  export const formatNumber = (num: number): string | number => {
    const isNegative = num < 0;
    const absNum = Math.abs(num);
  
    const format = (value: number, suffix: string) =>
      `${isNegative ? "-" : ""}${value.toFixed(2)} ${suffix}`;
  
    if (absNum >= 1e7) return format(absNum / 1e7, "Cr");
    if (absNum >= 1e5) return format(absNum / 1e5, "L");
    if (absNum >= 1e3) return format(absNum / 1e3, "K");
  
    return isNegative ? -absNum : absNum;
  };


  type TransactionType = number;

  interface ConvertObjectParams {
    option: OptionChainData;
    actid: string;
    lot: number;
    transaction: TransactionType;
  }
  
  export const convertObject = ({
    option,
    actid,
    lot,
    transaction
  }: ConvertObjectParams): PlaceOrderInput => {
    return {
      actid,
      exchange: option.exchage,
      orderNumber: option.orderNumber ?? undefined,
      price: "0",
      priceType: "MKT",
      productType: "I",
      quantity: (option.lotSize ?? 0) * lot,
      remarks: "option-chain",
      retention: "DAY",
      symbol: option.tradingSymbol,
      transactionType: transaction,
      triggerPrice: "0",
    };
  };
  export const updatePosition = (positions: PositionWithPnL[]) => {
    const updatedPositions = _.cloneDeep(positions);
    return updatedPositions.map(pos => {
      return {
      exchange: pos.exchange,
      orderNumber:"",
      price: "0",
      priceType: "MKT",
      productType: "I",
      quantity: pos.netQuantity,
      remarks: "option-chain",
      retention: "DAY",
      symbol: pos.symbol,
      triggerPrice: "0",
      transactionType: pos.netQuantity > 0 ? 0 : 1
      };
    });
  };


export const sleep=(ms:number)=> new Promise(res=>setTimeout(res,ms))