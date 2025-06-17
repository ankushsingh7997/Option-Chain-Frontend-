import React from "react";
import Index from "./Index";
import Portfolio from "./Portfolio";
import useMobileView from "../../../hooks/useMobileView";

const Trade: React.FC = () => {
  const isMobile=useMobileView()
  return (
    <div className="h-full  flex flex-col gap-4 ">
      {!isMobile && <Index/>}
      <Portfolio/>
    </div>
  );
};

export default Trade;