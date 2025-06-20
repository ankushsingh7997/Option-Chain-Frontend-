import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, InputNumber } from "antd";
import React, { useCallback } from "react"
import { formatDate, getExpiryItems, getLatestExpiryDate, INDEX_TICKER_MAP } from "../../../constant/websocketConstants";
import { store, useAppSelector } from "../../../store";
import { selectOptionChainState, selectTickerData } from "../../../store/selectors";
import { getExpiry, InstrumentCode } from "../../../constant/option";
import { setLotSize, setOptionChainParams } from "../../../store/slices/optionChainSlice";

const getCurrentIndexLabel = (selectedIndex: string) => selectedIndex ? INDEX_TICKER_MAP[String(selectedIndex)] : "NIFTY"

// Responsive dropdown styles 
const dropDownCss = "actions-dropdown-btn border !border-border !bg-atm !text-white !font-normal !h-[32px] xs:!h-[36px] sm:!h-[40px] !text-10 xs:!text-12 sm:!text-14 !flex items-center !justify-between !px-2 xs:!px-3 sm:!px-4"

const getCurrentExpiryLabel = (expiryDate: string, selectedIndex: string) => {
  if (expiryDate) return expiryDate;
  const defaultIndex = selectedIndex || "26000";
  const expiryDay = getExpiry(defaultIndex as InstrumentCode);
  const latestExpiryMoment = getLatestExpiryDate(expiryDay);
  return formatDate(latestExpiryMoment.toDate());
};

const Actions: React.FC = () => {
  const { selectedIndex, expiryDate, lots } = useAppSelector(selectOptionChainState)

  const indexItems: MenuProps['items'] = Object.entries(INDEX_TICKER_MAP).map(([token, label]) => ({
    key: token,
    label: label,
    onClick: () => handleIndexChange(token)
  }))

  const handleIndexChange = useCallback((index: string) => {
    const expiryDay = getExpiry(index as InstrumentCode);
    const latestExpiryMoment = getLatestExpiryDate(expiryDay);
    const latestExpiryDate = formatDate(latestExpiryMoment.toDate());
    
    const currentTicker = store.getState(); 
    const tickerData = selectTickerData(currentTicker); 
    const currentPrice = tickerData[index]?.lp;
    store.dispatch(setOptionChainParams({ selectedIndex: index, expiryDate: latestExpiryDate, currentPrice }))
  }, []) 

  const HandleExpiryChange = useCallback((index: string, expiry: string) => {
   
    const currentTicker = store.getState(); 
    const tickerData = selectTickerData(currentTicker); 
    const currentPrice = tickerData[index]?.lp;
    
    store.dispatch(setOptionChainParams({ selectedIndex: index, expiryDate: expiry, currentPrice }))
  }, []) 

  const HandleLotsChange = useCallback((lots: number | null) => {
    if (lots !== null) {
      store.dispatch(setLotSize({ lots }));
    }
  }, []) 

  return (
    <div className="h-14 xs:h-16 sm:h-20 w-full border border-light-gray flex items-center px-2 xs:px-3 sm:px-4 overflow-x-auto hide-scrollbar">
      {/* Mobile: Stack vertically on very small screens, horizontal on larger */}
      <div className="flex flex-col flex-row items-start xs:items-center gap-2 xs:gap-3 sm:gap-4 w-full min-w-fit ">
        
        {/* Index Dropdown */}
        <div className="flex-shrink-0 ">
          <Dropdown
            menu={{ items: indexItems }}
            overlayClassName="actions-dropdown-overlay"
            trigger={['click']}
          >
            <Button className={`${dropDownCss} min-w-[70px] xs:min-w-[85px] sm:min-w-[100px]`}>
              <span className="truncate">{getCurrentIndexLabel(selectedIndex)}</span>
              <DownOutlined className="ml-1 xs:ml-2 !text-10 xs:!text-11 sm:!text-12" />
            </Button>
          </Dropdown>
        </div>

        {/* Expiry Dropdown */}
        <div className="flex-shrink-0">
          <Dropdown 
            menu={{ items: getExpiryItems(selectedIndex, HandleExpiryChange) }}
            overlayClassName="actions-dropdown-overlay"
            trigger={['click']}
          >
            <Button className={`${dropDownCss} min-w-[90px] xs:min-w-[105px] sm:min-w-[120px]`}>
              <span className="truncate text-10 xs:text-11 sm:text-12">
                {getCurrentExpiryLabel(expiryDate as string, selectedIndex)}
              </span>
              <DownOutlined className="ml-1 xs:ml-2 !text-10 xs:!text-11 sm:!text-12" />
            </Button>
          </Dropdown>
        </div>

        {/* Lots Input */}
        <div className="flex-shrink-0">
          <InputNumber
            min={1}
            max={10}
            value={lots}
            onChange={(value) => HandleLotsChange(value)}
            className={`${dropDownCss} w-[60px] xs:w-[75px] sm:w-[110px] [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!text-center [&_.ant-input-number-input]:!text-10 xs:[&_.ant-input-number-input]:!text-11 sm:[&_.ant-input-number-input]:!text-12`}
          />
        </div>
      </div>
    </div>
  );
};

export default Actions