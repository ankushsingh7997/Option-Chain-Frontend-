import { POSITION_COLUMNS } from "../../../constant/trade"
import { useAppSelector } from "../../../store"
import { selectTickerByToken } from "../../../store/selectors"
import { Position } from "../../../graphql/trade/types"
import React, { useMemo } from "react"
import EmptyState from "../../ui/general/EmptyState"// Adjust path as needed
import { TRANSACTION_TYPES } from "../../../constant/websocketConstants"

const product: { [key: string]: string } = {
  M: "MIS",
  C: "CNC",
  I: "INTRA"
}

interface PositionWithPnL extends Position {
  pnl: number;
}

const getAvgPrice = (pos: PositionWithPnL) => {
  const { dayBuyQuantity, daySellQuantity, dayBuyAveragePrice, daySellAveragePrice } = pos;
  
  if (dayBuyQuantity > 0 && daySellQuantity === 0) {
    return formatCurrency(dayBuyAveragePrice);
  }
  if (daySellQuantity > 0 && dayBuyQuantity === 0) {
    return formatCurrency(daySellAveragePrice);
  }
  
  const totalQuantity = dayBuyQuantity + daySellQuantity;
  const weightedAvg = (dayBuyAveragePrice * dayBuyQuantity + daySellAveragePrice * daySellQuantity) / totalQuantity;
  
  return formatCurrency(weightedAvg);
};

const formatCurrency = (value: number) => {
  return `₹${value.toFixed(1)}`;
};

const Instrument: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => <span>{pos.symbol}</span>;

const Orders: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => <span>{product[pos.product]}</span>;

const BS: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => {
  const textColor = pos.netQuantity > 0 ? "text-profit" : "text-loss"
  const Value = pos.netQuantity > 0 ? TRANSACTION_TYPES.BUY : TRANSACTION_TYPES.SELL
  return <span className={textColor}>{Value}</span>
};

const AVG: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => <span>{getAvgPrice(pos)}</span>;

const LTP: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => {
  const selectCurrentTokenData = useMemo(() => selectTickerByToken(pos.token), [pos.token])
  const tickerData = useAppSelector(selectCurrentTokenData)
  return <span>{formatCurrency(Number(tickerData?.lp || 0)) || "--"}</span>;
}

const Lot: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => {
  const lots = pos.netQuantity !== 0 ?  pos.netQuantity / pos.lotSize  : "--"
  return <span>{lots}</span>;
}

const MTM: React.FC<{ pos: PositionWithPnL }> = ({ pos }) => {
  const textColor = pos.pnl > 0 ? "text-profit" : "text-loss"
  return <span className={textColor}>{formatCurrency(pos.pnl)}</span>;
}

const COMPONENT_MAP: { [key: string]: React.FC<{ pos: PositionWithPnL }> } = {
  instrument: Instrument,
  orders: Orders,
  bs: BS,
  avg: AVG,
  ltp: LTP,
  lot: Lot,
  mtm: MTM
};

interface PositionsProps {
  positions: PositionWithPnL[];
  showCheckboxes?: boolean;
  selectedPositions?: PositionWithPnL[];
  onPositionToggle?: (position: PositionWithPnL) => void;
  emptyMessage?: string;
}

const Positions: React.FC<PositionsProps> = React.memo(({ 
  positions, 
  showCheckboxes = false,
  selectedPositions = [],
  onPositionToggle,
  emptyMessage = "No active positions"
}) => {
  const handleCheckboxChange = (position: PositionWithPnL) => {
    onPositionToggle?.(position);
  };



  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 flex bg-background gap-2 p-2 justify-between">
        {POSITION_COLUMNS.map((col) => (
          <span 
            key={col.key} 
            className={showCheckboxes ? 
              col.key === 'mtm' ? 
                `w-[2%] flex items-center text-13` : 
                col.css 
              : col.css
            }
          >
            {col.title}
          </span>
        ))}
        {showCheckboxes && (
          <div className="w-[5%] flex items-center justify-center">
            <span className="text-13">Select</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0 p-2 w-full border border-light-gray overflow-y-auto hide-scrollbar">
        {positions.length === 0 ? (<EmptyState message={emptyMessage} icon={<span>📊</span>} /> ) : (
          positions.map((pos, i) => {
            const positionId = pos.symbol || pos.token || i.toString();
            const isSelected = selectedPositions.some(selectedPos => 
              (selectedPos.symbol || selectedPos.token) === positionId
            );
            
            return (
              <div key={positionId} className="flex h-[50px] justify-between flex-shrink-0">
                {POSITION_COLUMNS.map((col) => {
                  const Comp = COMPONENT_MAP[col.key];
                  return (
                    <div 
                      key={col.key} 
                      className={showCheckboxes ? 
                        col.key === 'mtm' ? 
                          `w-[2%] flex items-center text-13` : 
                          col.css 
                        : col.css
                      }
                    >
                      <Comp pos={pos} />
                    </div>
                  );
                })}
                {showCheckboxes && (
                  <div className="w-[5%] flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(pos)}
                      className="w-4 h-4"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
})

export default Positions