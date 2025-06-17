import { gql } from "@apollo/client";

/* -------------------------------------------------------------------------- */
/*  GET_TRADES                                                                */
/* -------------------------------------------------------------------------- */
export const GET_TRADES = gql`
  query GetTrader($actid: String!) {
    getTrades(actid: $actid) {
      status
      message
      data {
        margin {
          available_cash
          available_margin
          used_cash
        }
        orders {
          averagePrice
          exchange
          message
          orderNumber
          orderTime
          price
          triggerPrice
          priceType
          product
          quantity
          status
          symbol
          token
          transactionType
        }
        positions {
          dayBuyAmount
          dayBuyAveragePrice
          dayBuyQuantity
          daySellAmount
          daySellAveragePrice
          daySellQuantity
          exchange
          lotSize
          mult
          netQuantity
          netUploadQuantity
          userId
          product
          realizedPnl
          unrealizedMtom
          token
          symbol
          tickSize
          uploadPrice
        }
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*  GET_ORDERS                                                                */
/* -------------------------------------------------------------------------- */
export const GET_ORDERS = gql`
  query GetOrders($actid: String!) {
    getOrders(actid: $actid) {
      status
      message
      data {
        averagePrice
        exchange
        message
        orderNumber
        orderTime
        price
        triggerPrice
        priceType
        product
        quantity
        status
        symbol
        token
        transactionType
      }
    }
  }
`;

/* -------------------------------------------------------------------------- */
/*  PLACE_ORDER                                                               */
/* -------------------------------------------------------------------------- */
export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      data {
        orderNumber
        requestTime
      }
      message
      status
    }
  }
`;

export const PLACE_BULK_ORDERS=gql`
mutation PlaceBulkOrder($input: BulkPlaceOrderInput!){
  placeBulkOrders(input: $input) {
    message
    status
    data {
      failureCount
      successCount
    }
  }
}
`

/* -------------------------------------------------------------------------- */
/*  CANCEL_ORDER                                                              */
/* -------------------------------------------------------------------------- */
export const CANCEL_ORDER = gql`
  mutation CancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      data {
        orderNumber
        requestTime
      }
      message
      status
    }
  }
`;
