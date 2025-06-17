import { useMemo } from "react";
import { ORDER_COLUMNS } from "../../../constant/trade"
import { Order } from "../../../graphql/trade/types";
import { useAppSelector } from "../../../store";
import { selectOrders, selectTickerByToken } from "../../../store/selectors";
import EmptyState from "../../ui/general/EmptyState";

const product: { [key: string]: string } = {
  M: "MIS",
  C: "CNC",
  I: "INTRA"
}
const formatCurrency = (value: number) => {
  return `₹${value.toFixed(1)}`;
};
const Instrument: React.FC<{ ord: Order }> = ({ ord }) => <span>{ord.symbol}</span>;

const Product: React.FC<{ ord: Order }> = ({ ord }) => <span>{product[ord.product]}</span>;

const BS: React.FC<{ ord: Order }> = ({ ord }) => {
  const textColor = ord.transactionType==="B"  ? "text-profit" : "text-loss"
  const Value = ord.transactionType ==="B" ? "B" : "S"
  return <span className={textColor}>{Value}</span>
};

const Price: React.FC<{ ord: Order }> = ({ ord }) => {
  return <span>{formatCurrency(ord.price)}</span>
}

const LTP: React.FC<{ ord: Order }> = ({ ord }) => {
  const selectCurrentTokenData = useMemo(() => selectTickerByToken(ord.token), [ord.token])
  const tickerData = useAppSelector(selectCurrentTokenData)
  return <span>{formatCurrency(Number(tickerData?.lp || 0 )) || "--"}</span>;
}

const Status: React.FC<{ ord: Order }> = ({ ord }) => {
  return <span>{ord.status}</span>
}

const COMPONENT_MAP: { [key: string]: React.FC<{ ord: Order }> } = {
  instrument: Instrument,
  orders: Product,
  bs: BS,
  price: Price,
  ltp: LTP,
  status: Status
};
interface OrdersProps{
  emptyMessage?: string;
}

const Orders: React.FC <OrdersProps>= ({emptyMessage=""}) => {
  const orders = useAppSelector(selectOrders)
  
  return (
    <div className="flex flex-col h-full w-full ">
      <div className="flex-shrink-0 flex bg-background gap-2 p-2 justify-between">
        {ORDER_COLUMNS.map((col, index) => (
          <span key={index} className={col.css}>{col.title}</span>
        ))}
      </div>

      <div className="flex-1 border min-h-[300px] md:min-h-0 max-h-[400px] md:max-h-none p-2 w-full border border-light-gray overflow-y-auto hide-scrollbar">
    { orders.length===0 ?  <EmptyState message={emptyMessage} icon={<span>📊</span>} /> :
        orders.map((ord, i) => (
          <div key={i} className="flex h-[50px] justify-between flex-shrink-0">
            {ORDER_COLUMNS.map((col) => {
              const Comp = COMPONENT_MAP[col.key];
              return (
                <div key={col.key} className={col.css}>
                  <Comp ord={ord} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders