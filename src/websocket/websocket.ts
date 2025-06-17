// websocket.ts
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import {EventEmitter} from 'events';
import { shouldTriggerOrderAlert } from '../constant/websocketConstants';

export interface BrokerData {
  accessToken: string;
  actid: string;
  loginStatus?: boolean;
}

export interface TickerData {
  tk: string;
  lp: number;
  [key: string]: any;
}

export interface OrderMessage {
  t: string;
  reporttype: string;
  status: string;
  tsym: string;
  prctyp: string;
  rejreason?: string;
  actid: string;
  [key: string]: any;
}

export interface WebSocketMessage {
  t?: string;
  tk?: string;
  lp?: number;
  s?: string;
  reporttype?: string;
  status?: string;
  [key: string]: any;
}

export class TradingWebSocket extends EventEmitter {
  private ws: W3CWebSocket | null = null;
  private brokerData: BrokerData | null = null;
  private isConnected = false;
  private isOpen = false;
  reconnectAttempts = 0;
  // private maxReconnectAttempts = 5;
  // private reconnectDelay = 5000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private tokenSubscribed: { [key: string]: number } = {};
  private timeoutIds: { [key: string]: NodeJS.Timeout } = {};
  // private readonly updateDelay = 750;

  // Debouncing properties
  private tickerUpdateTimer: NodeJS.Timeout | null = null;
  private pendingTickerUpdates: Map<string, TickerData> = new Map();
  private readonly TICKER_BATCH_DELAY = 100; // 100ms batching
  private messageCount = 0;
  private lastMessageTime = Date.now();

  constructor(private websocketUrl: string) {
    super();
    this.setMaxListeners(20);
    this.websocketUrl = websocketUrl;
  }

  public connect(brokerData: BrokerData): void {
    if (!brokerData.accessToken || !brokerData.actid) {
      this.emit('error', new Error('Invalid broker data provided'));
      return;
    }

    this.brokerData = brokerData;
    this.createConnection();
  }

  private createConnection(): void {
    try {
      this.ws = new W3CWebSocket(this.websocketUrl);
      this.setupEventHandlers();
    } catch (error) {
      this.emit('error', error);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws || !this.brokerData) return;

    this.ws.onopen = () => {
      console.log('WebSocket open');
      this.isOpen = true;
      this.reconnectAttempts = 0;
      this.sendMessage({
        t: 'c',
        uid: this.brokerData!.actid,
        actid: this.brokerData!.actid,
        susertoken: this.brokerData!.accessToken,
        source: 'API'
      });
      this.emit('connected');
    };

    this.ws.onmessage = (data) => {
      try {
        const response: WebSocketMessage = JSON.parse(data.data as string);
        this.messageCount++;
        const now = Date.now();
      
        if (now - this.lastMessageTime > 1000) {
          this.messageCount = 0;
          this.lastMessageTime = now;
        }
        
        if (this.messageCount > 200) {
          console.warn('Rate limiting WebSocket messages');
          return;
        }
        
        this.handleMessage(response);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.emit('error', error);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      this.isConnected = false;
      this.clearTickerTimer();
      
      if (event.code !== 3001) {
        this.emit('connectionDropped');
        this.handleReconnection();
      } else {
        this.emit('disconnected');
      }
    };
  }

  private handleMessage(response: WebSocketMessage): void {
    if (response.s === 'OK') {
      this.subscribeToIndexTokens();
      this.subscribeToOrderUpdates();
      this.isConnected = true;
      this.emit('authenticated');
      return;
    }
    if (response.tk && response.lp !== undefined) {
      this.handleTickerUpdateDebounced(response as TickerData);
      return;
    }

    if (response.t === 'om') {
      this.handleOrderUpdate(response as OrderMessage);
      return;
    }

    this.emit('message', response);
  }

  private handleTickerUpdateDebounced(tickerData: TickerData): void {
    this.pendingTickerUpdates.set(tickerData.tk, tickerData);

    if (!(tickerData.tk in this.tokenSubscribed)) {
      this.tokenSubscribed[tickerData.tk] = tickerData.lp;
      this.emit('newTokenSubscription', tickerData);
    }

    if (this.tickerUpdateTimer) {
      clearTimeout(this.tickerUpdateTimer);
    }

    this.tickerUpdateTimer = setTimeout(() => {
      this.processPendingTickerUpdates();
    }, this.TICKER_BATCH_DELAY);
  }

  private processPendingTickerUpdates(): void {
    if (this.pendingTickerUpdates.size === 0) return;

    const updates = Array.from(this.pendingTickerUpdates.values());
    
    updates.forEach(tickerData => {
      this.emit('tickerUpdate', tickerData);
    });

    this.pendingTickerUpdates.clear();
    this.tickerUpdateTimer = null;
  }

  private clearTickerTimer(): void {
    if (this.tickerUpdateTimer) {
      clearTimeout(this.tickerUpdateTimer);
      this.tickerUpdateTimer = null;
    }
    this.pendingTickerUpdates.clear();
  }

  private handleOrderUpdate(orderMessage: OrderMessage): void {
    const shouldTriggerAlert = shouldTriggerOrderAlert(orderMessage.reporttype, orderMessage.status);
    if (shouldTriggerAlert) {
      const message = `${orderMessage.tsym} ${orderMessage.prctyp} Order ${orderMessage.status}${
        orderMessage.status === 'REJECTED' ? '\nReason - ' + orderMessage.rejreason : ''
      }`;

      this.emit('orderAlert', {
        type: orderMessage.status === 'REJECTED' ? 'error' : 'success',
        message,
        orderData: orderMessage
      });
    }
  }

  private subscribeToIndexTokens(): void {
    this.sendMessage({ 
      t: 't',
      k: 'NSE|26000#NSE|26009#NSE|26074#NSE|26037'
    });
  }

  private subscribeToOrderUpdates(): void {
    this.sendMessage({ t: 'o' });
  }

  public subscribeToOptionChain(tokens: string[]): void {
    if (!this.isConnected) {
      console.warn('WebSocket not connected, cannot subscribe to option chain');
      return;
    }

    const tokenString = tokens.join('#');
    this.sendMessage({
      t: 't',
      k: tokenString
    });
  }

  public unsubscribeFromTokens(tokens: string[]): void {
    if (!this.isConnected) return;

    const tokenString = tokens.join('#');
    this.sendMessage({
      t: 'u',
      k: tokenString
    });
  }

  public subscribeToPositions(positions: any[]): void {
    if (!positions.length || !this.isConnected) return;

    const tokens = positions.map(pos => `${pos.exchange}|${pos.token}`);
    const tokenString = tokens.join('#');
    
    this.sendMessage({
      t: 't',
      k: tokenString
    });
  }

  public subscribeToOrders(orders:any[]):void{
    if(!orders.length || !this.isConnected) return
    const tokens = orders.map(ord => `${ord.exchange}|${ord.token}`);
    const tokenString = tokens.join('#');
    
    this.sendMessage({
      t: 't',
      k: tokenString
    });
  }

  private sendMessage(message: any): void {
    if (this.ws && this.isOpen) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        this.emit('error', error);
      }
    }
  }

  private handleReconnection(): void {
     //   if (this.reconnectAttempts >= this.maxReconnectAttempts) {
  //     this.emit('maxReconnectAttemptsReached');
  //     return;
  //   }
  // // this.disconnect()
  //   this.reconnectAttempts++;
  //   console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

  //   this.reconnectTimer = setTimeout(() => {
  //     if (this.brokerData) {
  //       this.createConnection();
  //     }
  //   }, this.reconnectDelay * this.reconnectAttempts);

  //   this.emit('reconnecting', this.reconnectAttempts);
  
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.clearTickerTimer()
    Object.values(this.timeoutIds).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.timeoutIds = {};

    if (this.ws) {
      this.ws.close(3001);
      this.ws = null;
    }
    this.isConnected = false;
    this.tokenSubscribed = {};
    this.reconnectAttempts = 0;
    this.brokerData = null;
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public getSubscribedTokens(): { [key: string]: number } {
    return { ...this.tokenSubscribed };
  }

  public forceReconnect(): void {
    this.disconnect();
    if (this.brokerData) {
      setTimeout(() => {
        this.connect(this.brokerData!);
      }, 1000);
    }
  }
}