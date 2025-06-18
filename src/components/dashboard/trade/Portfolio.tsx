import React from "react";
import Button from "../../ui/Button/Button";
import Positions from "./Positions";
import Orders from "./Orders";
import { selectBrokerData, selectPositionsWithPnL } from "../../../store/selectors";
import { useAppSelector } from "../../../store";
import { Position } from "../../../graphql/trade/types";
import { useMutation } from "@apollo/client";
import { PLACE_BULK_ORDERS } from "../../../graphql/trade/trade";
import { updatePosition } from "../../../constant/option";
import { useToast } from "../../../hooks/useToast";
import TradesExecutions from "./TradeExecutions";
import Headers from "./Headers";



// Create a consistent position type with PnL
export interface PositionWithPnL extends Position {
  pnl: number;
}




const Portfolio: React.FC = () => {
  const [tab, setTab] = React.useState("open-position");
  const broker=useAppSelector(selectBrokerData)
  const [selectedPositions, setSelectedPositions] = React.useState<PositionWithPnL[]>([]);
  const [placeOrder]=useMutation(PLACE_BULK_ORDERS);
  const positions = useAppSelector(selectPositionsWithPnL);
  const openPositions = React.useMemo(() => positions.filter(pos => pos.netQuantity !== 0), [positions]);
  const toast=useToast()
  const allSelected = openPositions.length > 0 && selectedPositions.length === openPositions.length;

  const handlePositionToggle = (position: PositionWithPnL) => {
    const positionId = position.symbol
    setSelectedPositions(prev => 
      prev.find(pos => pos.symbol  === positionId)
        ? prev.filter(pos => pos.symbol !== positionId)
        : [...prev, position]
    );
  };

  const handleSelectAll = () => {
    setSelectedPositions([...openPositions]);
  };

  const handleDeselectAll = () => {
    setSelectedPositions([]);
  };

  const handleExitSelected =async () => {
   
    const orders=updatePosition(selectedPositions)
    const {data}=await placeOrder({variables: { input:{orders,actid:broker?.actid} }})
    let response=data.placeBulkOrders
    if (response.status) toast.success(response.message)
    else toast.error(response.message)
  
    setSelectedPositions([]);
  };

  React.useEffect(() => {
    if (tab !== "open-position") {
      setSelectedPositions([]);
    }
  }, [tab]);

  return (
    <div className="h-[87%] flex flex-col gap-2">
      <Headers
        tab={tab} 
        setTab={setTab} 
        selectedPositions={selectedPositions}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        allSelected={allSelected}
        onExitSelected={handleExitSelected}
      />
      <TradesExecutions 
        tab={tab} 
        selectedPositions={selectedPositions}
        onPositionToggle={handlePositionToggle}
      />
    </div>
  );
};

export default Portfolio;