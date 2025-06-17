// Dashboard.tsx
import Header from "../components/layout/Header";
import Option from "../components/dashboard/option-chain/Option";
import Trade from "../components/dashboard/trade/Trade";
import useMobileView from "../hooks/useMobileView";
// import useMobileView from "../hooks/useMobileView";

const Mobile=()=>{
return (<div className="md:hidden">
 
  <div className="h-[calc(100vh-80px)] pt-4 px-4">
    <Option />
  </div>
  
  <div className="min-h-screen pt-4 px-4">
    <Trade />
  </div>
</div>)
}

const Desktop=()=>{
  return (<div className="hidden md:flex h-[calc(100vh-80px)] pt-4 px-4 gap-4 overflow-hidden">
    <div className="w-[35%] h-full">
      <Option />
    </div>
    <div className="w-[65%] h-full">
      <Trade />
    </div>
  </div>)
}

export default function Dashboard() {
  const isMobile=useMobileView()
  return (
    <div className="w-full min-h-screen">
      <Header page="Dashboard" />
      
     {isMobile?<Mobile/>:<Desktop/>}
      
    </div>
  );
}