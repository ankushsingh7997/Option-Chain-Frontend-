import React from "react";
import { useAppSelector } from "../../../store";
import { selectPositionsWithPnL } from "../../../store/selectors";
import { PositionWithPnL } from "./Portfolio";
import Positions from "./Positions";
import Orders from "./Orders";

type TradesProps = {
    tab: string;
    selectedPositions?: PositionWithPnL[];
    onPositionToggle?: (position: PositionWithPnL) => void;
  };
  
  const TradesExecutions: React.FC<TradesProps> = ({ tab, selectedPositions, onPositionToggle }) => {
    const positions = useAppSelector(selectPositionsWithPnL);
    const openPosition = React.useMemo(() => positions.filter(pos => pos.netQuantity !== 0), [positions]);
    const closePosition = React.useMemo(() => positions.filter(pos => pos.netQuantity === 0), [positions]);
    
    const tabsAttribute = {
      "open-position": () => (
        <div className="h-[100%]">
          <Positions 
            positions={openPosition} 
            showCheckboxes={true}
            selectedPositions={selectedPositions}
            onPositionToggle={onPositionToggle}
            emptyMessage="No active Positions"
          />
        </div>
      ),
      "close-position": () => (
        <div className="h-[100%]">
          <Positions positions={closePosition}  emptyMessage="No closed Positions"/>
        </div>
      ),
      "orders": () => (
        <div className="h-[100%]">
          <Orders emptyMessage="No orders Available"/>
        </div>
      )
    };
  
    const renderTab = tabsAttribute[tab as keyof typeof tabsAttribute];
  
    return (
      <div className="h-[85%]">
        {renderTab()}
      </div>
    );
  };


  export default TradesExecutions