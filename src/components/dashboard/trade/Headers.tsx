import Button from "../../ui/Button/Button";
import { PositionWithPnL } from "./Portfolio";
const tabs = ["open-position", "close-position", "orders"];
type HeaderProps = {
    tab: string;
    setTab: React.Dispatch<React.SetStateAction<string>>;
    selectedPositions?: PositionWithPnL[];
    onSelectAll?: () => void;
    onDeselectAll?: () => void;
    allSelected?: boolean;
    onExitSelected?: () => void;
  };
  
  const Headers: React.FC<HeaderProps> = ({ 
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


  export default Headers