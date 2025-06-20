import axios from "axios"
import _ from "lodash"

import { getTradingSymbol,getNearestStrikePrice,createFullTokenString,INDEX_TICKER_MAP,STRIKE_DIFFERENCES, parseTokenFromSymbol } from "../constant/websocketConstants"

export interface OptionChainData{
    exchage:string;
    token:string;
    tradingSymbol:string
    strikePrice:string;
    optionType:"CE" |"PE";
    [key:string]:any;
}

export interface OptionObject{
    [strike:string]:{
        CE? : OptionChainData & { bought? : boolean; quantity? : number};
        PE? : OptionChainData & { bought? : boolean; quantity? : number};
    }
}

export class OptionChainManager{
    private brokerData: any;
    private onDataUpdate?: (data: OptionChainData[]) => void;
    private onError?: (error: Error) => void;

    constructor(brokerData:any,onDataUpdate?:(data:OptionChainData[])=>void, onError?: (error: Error) => void){
        this.brokerData=brokerData
        this.onDataUpdate=onDataUpdate;
        this.onError=onError;
    }

    public async getOptionChain( tradingSymbol: string, strike: string | number): Promise<OptionChainData[] | null> {
        try {
          const {data} = await axios.post('https://connect.thefirstock.com/api/V4/optionChain',
            {
              userId: this.brokerData?.actid,
              jKey: this.brokerData?.accessToken,
              exchange: 'NFO',
              tradingSymbol: tradingSymbol,
              strikePrice: String(strike),
              count: '20',
            }
          );
    
          const optionData = (data as { data: any[] }).data; 
          if (this.onDataUpdate) this.onDataUpdate(optionData);
          return optionData;
        } catch (error) {
          console.error('Error fetching option chain:', error);
          if (this.onError) this.onError(error as Error);  
          return null;
        }
      }

    //   convert option chain array to object

    public convertToOptionObject(optionData:OptionChainData[]):OptionObject{
        const optionOjbect:OptionObject={}
        for(const option of optionData){
            const strike=String(Number(option.strikePrice));
            if(!optionOjbect[strike]){
                optionOjbect[strike]={};
            }
            optionOjbect[strike][option.optionType]=option;
        }

        return optionOjbect
    }

    public async getOptionChainForIndex(selectedIndex:string,currentPrice:number,expiryDate:string):Promise<{
        data: OptionChainData[] | null;
        optionObject: OptionObject;
        tokens: string[];
      }>{
        const indexName=INDEX_TICKER_MAP[selectedIndex as keyof typeof INDEX_TICKER_MAP]
        if (!indexName) {
            throw new Error(`Invalid index selected: ${selectedIndex}`);
          }
        const tradingSymbol=getTradingSymbol(indexName,currentPrice,expiryDate);
        const nearestStrike=getNearestStrikePrice(currentPrice,STRIKE_DIFFERENCES[indexName as keyof typeof STRIKE_DIFFERENCES])

        const optionData=await this.getOptionChain(tradingSymbol,nearestStrike);

        if (!optionData) return { data: null,optionObject: {},tokens: []};
          const optionObject = this.convertToOptionObject(optionData);
          const tokens = this.createTokensFromOptionData(optionData);
        return { data: optionData, optionObject, tokens };

    }

    public createTokensFromOptionData(optionData:OptionChainData[]):string[]{
        return optionData.map(option=>`${option.exchange}|${option.token}`)
    }
    public createFullTokenString(optionData: OptionChainData[]): string {
        return createFullTokenString(optionData);
    }

    public mapPositionsToOptionObject(
        positions: any[], 
        optionObject: OptionObject
      ): OptionObject {
        const updatedOptionObject = _.cloneDeep(optionObject);
    
        positions.forEach(position => {
          const { strike, optionType } = this.parsePositionSymbol(position.symbol);
          
          if (updatedOptionObject[strike] && 
              updatedOptionObject[strike][optionType] &&
              updatedOptionObject[strike][optionType]?.tradingSymbol === position.symbol) {
            
              updatedOptionObject[strike][optionType] = {
              ...updatedOptionObject[strike][optionType]!,
              bought: position.netQuantity !== 0,
              quantity: position.netQuantity
            };
          }
        });
    
        return updatedOptionObject;
    }


      private parsePositionSymbol=parseTokenFromSymbol


    public updateBrokerData(brokerData:any):void{
        this.brokerData=brokerData;
    }
}
