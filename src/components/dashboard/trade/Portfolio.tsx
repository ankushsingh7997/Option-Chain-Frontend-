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

const tabs = ["open-position", "close-position", "orders"];

// Create a consistent position type with PnL
export interface PositionWithPnL extends Position {
  pnl: number;
}

type HeaderProps = {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
  selectedPositions?: PositionWithPnL[];
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  allSelected?: boolean;
  onExitSelected?: () => void;
};

const Header: React.FC<HeaderProps> = ({ 
  tab, 
  setTab, 
  selectedPositions = [], 
  onSelectAll, 
  onDeselectAll, 
  allSelected = false,
  onExitSelected 
}) => {
  const handleSelectAllChange = () => {
    if (allSelected) {
      onDeselectAll?.();
    } else {
      onSelectAll?.();
    }
  };

  return (
    <div className="bg-background-2 w-full h-[10%] py-2 flex items-center justify-between">
      <div className="w-[83%] px-2 flex items-center justify-start gap-5">
        {tabs.map((key) => (
          <span
            key={key}
            onClick={() => setTab(key)}
            className={`cursor-pointer w-[150px] ${
              tab === key ? "font-semibold text-sec-blue w-[150px]" : ""
            }`}
          >
            {key}
          </span>
        ))}
      </div>
      {tab === "open-position" && (
        <div className="w-[17%] flex justify-end items-center gap-3 px-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllChange}
              className="w-4 h-4"
            />
          </div>
          <Button 
            text={`Exit (${selectedPositions.length})`} 
            variant="primary"
            onClick={onExitSelected}
            disabled={selectedPositions.length === 0}
            className="border border-light-gray rounded-sm"
          />
        </div>
      )}
    </div>
  );
};

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
      <Header 
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