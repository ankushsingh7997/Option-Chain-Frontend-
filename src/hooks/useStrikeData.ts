import { useAppSelector } from "../store";
import { isITM, isAtmStrike } from "../constant/option";
import { selectOptionObject, selectOptionChainState, selectMaxOI, selectTickerByToken,} from "../store/selectors";
import { useMemo } from "react";


const flowObj: { [key: string]: string } = {
  itm: "bg-itm",
  atm: "bg-atm",
};

export const useStrikeData = (strike: string | number) => {
  const optionObject = useAppSelector(selectOptionObject);
  const option = useAppSelector(selectOptionChainState);
  const { maxCallOi, maxPutOi } = useAppSelector(selectMaxOI)
  const selectIndexLtp = useMemo(
    () => selectTickerByToken(option.selectedIndex as string),
    [option.selectedIndex]
  );
  const indexTicker = useAppSelector(selectIndexLtp);
  const strikeNum = Number(strike);
  const currentIndexVal = Number(indexTicker?.lp ?? 0);
  const selectedToken = Number(option.selectedIndex);

  const callItm = isITM({ type: "CE", strike: strikeNum, currentIndexVal });
  const putItm = isITM({ type: "PE", strike: strikeNum, currentIndexVal });
  const atm = isAtmStrike({
    strike: strikeNum,
    currentIndexVal,
    token: selectedToken,
  });

  const callBg = atm ? flowObj.atm : callItm ? flowObj.itm : "";
  const putBg = atm ? flowObj.atm : putItm ? flowObj.itm : "";
  const strikeBg = atm ? flowObj.atm : "";
  const callOption=optionObject[strike]?.CE
  const putOption=optionObject[strike]?.PE

  const callTk = callOption?.token as string | undefined;
  const putTk = putOption?.token as string | undefined;

   const callSelector = useMemo(() =>callTk ? selectTickerByToken(callTk) : () => undefined, [callTk]
  );
  
  const putSelector = useMemo(() =>putTk ? selectTickerByToken(putTk) : () => undefined,[putTk]
  );


  const call = useAppSelector(callSelector) 
  const put = useAppSelector(putSelector) 

  const callOi = Number(call?.oi ?? 0);
  const putOi = Number(put?.oi ?? 0);


  return {
    atm, callBg, putBg, strikeBg, callLtp: String(call?.lp ?? "--"), putLtp: String(put?.lp ?? "--"), callOi, putOi, callPoi: call?.poi ?? 0, putPoi: put?.poi ?? 0, maxCallOi, maxPutOi,callOption,putOption
  };
};
