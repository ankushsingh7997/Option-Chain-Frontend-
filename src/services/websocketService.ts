import { TradingWebSocket, BrokerData } from "../websocket/websocket";
import { OptionChainManager } from "../websocket/optionChainUtils";
import { store } from "../store";
import {setInstance,setConnected,updateTickerData,setError as setWebSocketError,disconnect} from "../store/slices/websocketSlice";
import {setLoading,setOptionChainData,setError as setOptionChainError} from "../store/slices/optionChainSlice";
import {setLoading as setTradingLoading,setPositions,setOrders,setError as setTradingError} from "../store/slices/tradingSlice";
import { getExpiry, InstrumentCode, sleep } from "../constant/option";
import { formatDate, getLatestExpiryDate, WEBSOCKET_EVENTS } from "../constant/websocketConstants";
import { GET_TRADES } from "../graphql/trade/trade";
import type {GetTraderResponse,GetTraderVariables,Position,Order} from "../graphql/trade/types";
import client from "../apollo/client";
import { addToast } from "../store/slices/toastSlice";

class WebSocketService {
  private ws: TradingWebSocket | null = null;
  private optionChainManager: OptionChainManager | null = null;
  private websocketUrl: string;
  
  private orderAlertTimer: NodeJS.Timeout | null = null;
  private dataFetchTimer: NodeJS.Timeout | null = null;
  private broker:BrokerData | null=null


  constructor(websocketUrl: string) {
    this.websocketUrl = websocketUrl;
  }

  public async connect(brokerData: BrokerData): Promise<void> {
    if (this.ws?.getConnectionStatus()) {
      console.log("WebSocket already connected");
      return;
    }

    try {
      this.ws = new TradingWebSocket(this.websocketUrl);
      store.dispatch(setInstance(this.ws));

      this.optionChainManager = new OptionChainManager(brokerData);
      this.setupWebSocketListeners();
      this.ws.connect(brokerData);
      this.broker=brokerData
    } catch (error: any) {
      console.error("Failed to connect WebSocket:", error);
      store.dispatch(setWebSocketError(error.message));
    }
  }
  

  private setupWebSocketListeners(): void {
    if (!this.ws) return;
  
    this.ws.on(WEBSOCKET_EVENTS.CONNECTED, () => {
      console.log("WebSocket event:", WEBSOCKET_EVENTS.CONNECTED);
      store.dispatch(setConnected(true));
    });
  
    this.ws.on(WEBSOCKET_EVENTS.AUTHENTICATED, async () => {
      console.log("WebSocket event:", WEBSOCKET_EVENTS.AUTHENTICATED);
      await this.autoFetchOptionChain();
    });
  
    this.ws.on(WEBSOCKET_EVENTS.DISCONNECTED, () => {
      console.log("WebSocket event:", WEBSOCKET_EVENTS.DISCONNECTED);
      this.clearTimers();
      store.dispatch(disconnect());
    });
  
    this.ws.on(WEBSOCKET_EVENTS.CONNECTION_DROPPED, () => {
      console.log("WebSocket event:", WEBSOCKET_EVENTS.CONNECTION_DROPPED);
      store.dispatch(setConnected(false));
    });
  
    this.ws.on(WEBSOCKET_EVENTS.TICKER_UPDATE, (tickerData) => {
      store.dispatch(updateTickerData(tickerData));
    });
  
    this.ws.on(WEBSOCKET_EVENTS.ORDER_ALERT, (alertData) => {
      console.log("WebSocket event:", WEBSOCKET_EVENTS.ORDER_ALERT, alertData);
      if (alertData.type === "error") {
        store.dispatch(addToast({ message: alertData.message, type: 'error' }));
      }
      this.debounceFetchTradingData(alertData.orderData.actid);
    });
  
    this.ws.on(WEBSOCKET_EVENTS.ERROR, (error) => {
      console.error("WebSocket event:", WEBSOCKET_EVENTS.ERROR, error);
      store.dispatch(setWebSocketError(error.message));
    });
  }
  

  private debounceFetchTradingData(actid: string): void {
    this.clearTimers();
    
    this.dataFetchTimer = setTimeout(async () => {
      await this.fetchTradingData(actid);
      this.dataFetchTimer = null;
    }, 1000);
  }

  private clearTimers(): void {
    if (this.orderAlertTimer) {
      clearTimeout(this.orderAlertTimer);
      this.orderAlertTimer = null;
    }
    if (this.dataFetchTimer) {
      clearTimeout(this.dataFetchTimer);
      this.dataFetchTimer = null;
    }
  }

  private async autoFetchOptionChain(): Promise<void> {
    if (!this.ws?.getConnectionStatus()) return;
    await sleep(400)
    const state = store.getState();
    const { selectedIndex, } = state.optionChain;
    const currentPrice= state.websocket.tickerData[selectedIndex]?.lp
    const expiryDay = getExpiry(selectedIndex as InstrumentCode);
    const latestExpiryMoment = getLatestExpiryDate(expiryDay);
    const latestExpiryDate = formatDate(latestExpiryMoment.toDate());
    if (selectedIndex && currentPrice && latestExpiryDate) {
      console.log("Auto-fetching option chain after authentication");
      await this.fetchOptionChain(selectedIndex, currentPrice, latestExpiryDate);
    }
   if(!this.broker) return 
    this.debounceFetchTradingData(this.broker?.actid);
  }

  public async fetchOptionChain(selectedIndex: string,currentPrice: number,latestExpiryDate: string): Promise<void> {
    if (!this.optionChainManager) {
      console.error("Option chain manager not initialized");
      return;
    }

    store.dispatch(setLoading(true));

    try {
      const result = await this.optionChainManager.getOptionChainForIndex(selectedIndex,currentPrice,latestExpiryDate);

      if (result.data) {store.dispatch(setOptionChainData({optionData: result.data,optionObject: result.optionObject,tokens: result.tokens,}));

        if (this.ws && result.tokens.length > 0) {
          this.ws.subscribeToOptionChain(result.tokens);
        }

        const positions = store.getState().trading.positions;
        if (positions.length > 0) {
          this.updatePositionsMapping();
        }
      }
    } catch (error: any) {
      console.error("Error fetching option chain:", error);
      store.dispatch(setOptionChainError(error.message));
    } finally {
      store.dispatch(setLoading(false));
    }
  }

  private async fetchTradingData(actid: string): Promise<void> {
    store.dispatch(setTradingLoading(true));

    try {
      const {position,order} = await this.fetchTrade(actid)

      if (position) {
        store.dispatch(setPositions(position));
        this.updatePositionsMapping();
        if (this.ws && position.length > 0) {
          this.ws.subscribeToPositions(position);
        }
      }

      if (order) {
        store.dispatch(setOrders(order));
        if(this.ws) this.ws.subscribeToOrders(order)
      }
    } catch (error: any) {
      console.error("Error fetching trading data:", error);
      store.dispatch(setTradingError(error.message));
    } finally {
      store.dispatch(setTradingLoading(false));
    }
  }

  private async fetchTrade(actid: string): Promise<{position:Position[],order:Order[]}> {
    try {
      const { data } = await client.query<GetTraderResponse, GetTraderVariables>({
        query: GET_TRADES,
        variables: { actid },
        fetchPolicy: "network-only"
      });
      return {position:data.getTrades.data.positions,order:data.getTrades.data.orders}
    } catch (error: any) {
      console.error("Error fetching positions:", error);
      return {position:[],order:[]};
    }
  }

  // private async fetchOrders(actid: string): Promise<any[] | null> {
  //   try {
  //     const { data } = await client.query<GetOrdersResponse, GetOrdersVariables>({
  //       query: GET_ORDERS,
  //       variables: { actid },
  //       fetchPolicy: "network-only"
  //     });
  //     return data.getOrders.data || [];
  //   } catch (error: any) {
  //     console.error("Error fetching orders:", error);
  //     return [];
  //   }
  // }

  private updatePositionsMapping(): void {
    // private updatePositionsMapping(positions: any[]): void {
    if (!this.optionChainManager) return;

    const state = store.getState();
    const { optionObject } = state.optionChain;

    if (Object.keys(optionObject).length > 0) {
      // const mappedOptionObject = this.optionChainManager.mapPositionsToOptionObject(positions,optionObject);
      // store.dispatch(updateOptionObject(mappedOptionObject));
    }
  }

  public subscribeToOptionChain(tokens: string[]): void {
    if (this.ws) {
      this.ws.subscribeToOptionChain(tokens);
    }
  }

  public unsubscribeFromTokens(tokens: string[]): void {
    if (this.ws) {
      this.ws.unsubscribeFromTokens(tokens);
    }
  }

  public disconnect(): void {
    this.clearTimers();
    
    if (this.ws) {
      this.ws.disconnect();
      this.ws = null;
    }
    
    this.optionChainManager = null;
    store.dispatch(disconnect());
  }

  public forceReconnect(): void {
    if (this.ws) {
      this.ws.forceReconnect();
    }
  }

  public getConnectionStatus(): boolean {
    return this.ws?.getConnectionStatus() || false;
  }
}

export const websocketService = new WebSocketService(
  import.meta.env.VITE_WEBSOCKET_URL
);