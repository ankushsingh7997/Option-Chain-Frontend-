import Header from "../components/layout/Header";
import Option from "../components/dashboard/option-chain/Option";
import Trade from "../components/dashboard/trade/Trade";
import useMobileView from "../hooks/useMobileView";

export default function Dashboard() {
  const isMobile = useMobileView();

  const containerClass = isMobile
    ? "pt-4 px-4" : "flex h-[calc(100vh-80px)] pt-4 px-4 gap-4 overflow-hidden";

  const optionClass = isMobile
    ? "h-[calc(100vh-80px)]" : "w-[35%] h-full";

  const tradeClass = isMobile ? "min-h-screen pt-4" : "w-[65%] h-full";

  return (
    <div className="w-full min-h-screen">
      <Header page="Dashboard" />
      <div className={containerClass}>
        <div className={optionClass}>
          <Option />
        </div>
        <div className={tradeClass}>
          <Trade />
        </div>
      </div>
    </div>
  );
}
