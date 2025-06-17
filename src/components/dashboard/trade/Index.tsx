import React, { useMemo } from "react";
import { useAppSelector } from "../../../store";
import { INDEX_TICKER_MAP } from "../../../constant/websocketConstants";
import { selectMTM, selectTickerByToken } from "../../../store/selectors";

const Ticker: React.FC<{ token: string; label: string }> = React.memo(({ token, label }) => {
  const selectCurrentTokenData = useMemo(() => selectTickerByToken(token), [token]);
  const tickerData = useAppSelector(selectCurrentTokenData);

  const ltp = tickerData?.lp ?? 0;
  const percentageChange = tickerData?.pc ?? 0;
  const change = ((ltp * percentageChange) / 100).toFixed(2);
  const textColor = percentageChange > 0 ? "text-profit" : "text-loss";

  return (
    <div className="h-[50px] flex flex-col items-start justify-center w-[163px] text-12 font-semibold">
      <div className="flex items-center justify-center h-[50%]">{label}</div>
      <div className={`flex items-center justify-between h-[50%] w-full ${textColor}`}>
        <span>{ltp}</span>
        <span className="font-normal">{`${change} (${percentageChange}%)`}</span>
      </div>
    </div>
  );
});

const Mtm: React.FC = () => {
  const mtm=useAppSelector(selectMTM)
  const style=mtm > 0 ?"text-profit":mtm < 0 ? "text-loss":""
  return (
    <div className={`border border-light-gray h-[50px] flex items-center justify-around w-[150px]`}>
      MTM : <span className={`${style} flex items-center justify-center`}>{mtm}</span>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="h-[10%] overflow-x-auto overflow-y-hidden hide-scrollbar">
      <div className="flex gap-4 min-w-max">
        <Mtm />
        {Object.entries(INDEX_TICKER_MAP).map(([token, label]) => (
          <Ticker key={token} token={token} label={label} />
        ))}
      </div>
    </div>
  );
};

export default Index;
