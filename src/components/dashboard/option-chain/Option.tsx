
import React, { useEffect } from "react";
import { websocketService } from "../../../services/websocketService";
import OptionChain from "./OptionChain";
import Actions from "./Actions";
import Index from "../trade/Index";
import useMobileView from "../../../hooks/useMobileView";
import { useAppSelector } from "../../../store";
import { selectBrokerData } from "../../../store/selectors";

const Option: React.FC = () => {
  const brokerData=useAppSelector(selectBrokerData)
  const isMobile=useMobileView()

useEffect(()=>{
  if (brokerData?.loginStatus) websocketService.connect({accessToken:brokerData.accessToken as string,actid:brokerData.actid,loginStatus:brokerData.loginStatus})
},[brokerData?.loginStatus])

  return (
    <div className="h-full flex flex-col gap-y-4">
      {isMobile && <Index/>}
      <Actions />
      <OptionChain />
    </div>
  );
};

export default Option;

// Trade.tsx
