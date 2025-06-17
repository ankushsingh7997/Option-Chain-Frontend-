import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space, InputNumber } from "antd";
import React, { useCallback } from "react"
import { formatDate, getExpiryItems, getLatestExpiryDate, INDEX_TICKER_MAP } from "../../../constant/websocketConstants";
import { store, useAppSelector } from "../../../store";
import { selectOptionChainState, selectTickerData } from "../../../store/selectors";
import { getExpiry, InstrumentCode } from "../../../constant/option";
import { setLotSize, setOptionChainParams } from "../../../store/slices/optionChainSlice";

const getCurrentIndexLabel = (selectedIndex: string) => selectedIndex ? INDEX_TICKER_MAP[String(selectedIndex)] : "NIFTY"

const dropDownCss = "actions-dropdown-btn border !border-border !bg-atm !text-white !font-normal !h-[40px] !text-14 !flex items-center !justify-between"

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
    <div className="h-20 w-full border border-light-gray flex items-center px-4">
      <Space size='middle'>
        <Dropdown
          menu={{ items: indexItems }}
          overlayClassName="actions-dropdown-overlay"
          trigger={['click']}
        >
          <Button className={dropDownCss}>
            <span>{getCurrentIndexLabel(selectedIndex)}</span>
            <DownOutlined />
          </Button>
        </Dropdown>
        <Dropdown menu={{ items: getExpiryItems(selectedIndex, HandleExpiryChange) }}
          overlayClassName="actions-dropdown-overlay"
          trigger={['click']}
        >
          <Button className={dropDownCss}>
            <span>{getCurrentExpiryLabel(expiryDate as string, selectedIndex)}</span>
            <DownOutlined />
          </Button>
        </Dropdown>
        <InputNumber
          min={1}
          max={10}
          value={lots}
          onChange={(value) => HandleLotsChange(value)}
          className={`${dropDownCss} w-[110px] [&_.ant-input-number-input]:!text-white [&_.ant-input-number-input]:!text-center`}
        />
      </Space>
    </div>
  );
};

export default Actions