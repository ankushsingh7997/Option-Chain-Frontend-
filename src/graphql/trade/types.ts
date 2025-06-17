/* -------------------------------------------------------------------------- */
/*  VARIABLES                                                                 */
/* -------------------------------------------------------------------------- */
export interface GetTraderVariables {
    actid: string;
  }
  
  export interface GetOrdersVariables {
    actid: string;
  }
  
  export interface PlaceOrderVariables {
    input: PlaceOrderInput;
  }
  
  export interface CancelOrderVariables {
    input: CancelOrderInput;
  }
  
  /* -------------------------------------------------------------------------- */
  /*  GET_TRADES RESPONSE                                                       */
  /* -------------------------------------------------------------------------- */
  export interface GetTraderResponse {
    getTrades: {
      status: boolean;
      message: string;
      data: {
        margin: {
          available_cash: number;
          available_margin: number;
          used_cash: number;
        };
        orders: Order[];
        positions: Position[];
      };
    };
  }
  

  export interface Position {
    dayBuyAmount: number;
    dayBuyAveragePrice: number;
    dayBuyQuantity: number;
    daySellAmount: number;
    daySellAveragePrice: number;
    daySellQuantity: number;
    exchange: string;
    lotSize: number;
    mult: number;
    netQuantity: number;
    netUploadQuantity: number;
    userId: string;
    product: string;
    realizedPnl: number;
    unrealizedMtom: number;
    token: string;
    symbol: string;
    tickSize: number;
    uploadPrice: number;
  }
  
  export interface Order {
    averagePrice: number;
    exchange: string;
    message: string;
    orderNumber: string;
    orderTime: string;
    price: number;
    triggerPrice: string;
    priceType: string;
    product: string;
    quantity: number;
    status: string;
    symbol: string;
    token: string;
    transactionType: string;
  }
  
 
  /* -------------------------------------------------------------------------- */
  /*  GET_ORDERS RESPONSE                                                       */
  /* -------------------------------------------------------------------------- */
  export interface OrderData {
    averagePrice: number;
    exchange: string;
    message: string;
    orderNumber: string;
    orderTime: string;
    price: number;
    triggerPrice: string;
    priceType: string;
    product: string;
    quantity: number;
    status: string;
    symbol: string;
    token: string;
    transactionType: string;
  }
  
  export interface GetOrdersResponse {
    getOrders: {
      status: boolean;
      message: string;
      data: OrderData[];
    };
  }
  
  /* -------------------------------------------------------------------------- */
  /*  PLACE_ORDER INPUT & RESPONSE                                              */
  /* -------------------------------------------------------------------------- */
  export interface PlaceOrderInput {
    actid: string;
    exchange: string;
    orderNumber?: string;
    price: string ;
    priceType: string;
    productType: string;
    quantity: number;
    remarks: string;
    retention: string;
    symbol: string;
    transactionType: number;
    triggerPrice: string;
  }
  
  export interface PlaceOrderResponse {
    placeOrder: {
      data: {
        orderNumber: string;
        requestTime: string;
      };
      message: string;
      status: boolean;
    };
  }
  
  /* -------------------------------------------------------------------------- */
  /*  CANCEL_ORDER INPUT & RESPONSE                                             */
  /* -------------------------------------------------------------------------- */
  export interface CancelOrderInput {
    actid: string;
    orderNumber: string;
  }
  
  export interface CancelOrderResponse {
    cancelOrder: {
      data: {
        orderNumber: string;
        requestTime: string;
      };
      message: string;
      status: boolean;
    };
  }
  