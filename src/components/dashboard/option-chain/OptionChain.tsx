import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Lock } from 'lucide-react';
import { useAppSelector } from "../../../store";
import { selectBrokerData, selectOptionObject } from "../../../store/selectors";
import StrikeLtp from "./Strike";
import EmptyState from '../../broker/EmptyState';
import Button from '../../ui/Button/Button';

const OptionChain: React.FC = () => {
  const navigate = useNavigate();
  const optionObject = useAppSelector(selectOptionObject);
  const broker = useAppSelector(selectBrokerData);

  // Component for Option Chain Data
  const OptionChainData = () => (
    <>
      <div className="w-full h-[10%] flex items-center text-12 border-b border-b-light-gray bg-atm">
        <div className="w-[40%] h-[100%] flex items-center justify-start pl-2">
          <div className="w-[50%] flex justify-between">
            <span>Call LTP</span>
            <span>OI Chg</span>
          </div>
        </div>
        <div className="w-[20%] h-[100%] flex items-center justify-center">
          Strike
        </div>
        <div className="w-[40%] h-[100%] flex items-center justify-end pr-2">
          <div className="w-[50%] flex justify-between">
            <span>OI Chg</span>
            <span>Put Ltp</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {Object.keys(optionObject).map((strike) => (
          <StrikeLtp key={strike} strike={strike.toString()} />
        ))}
      </div>
    </>
  );
  
  const renderContent = () => {
    if (!broker) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={<Plus className="w-8 h-8 text-sec-blue" />}
            title="Connect Your Broker"
            message="Connect your broker account to view live option chain data and place trades"
            actionButton={
              <Button 
                text="Go to Broker Page"
                variant="primary"
                onClick={() => navigate('/broker')}
                className="h-12 text-white rounded-lg"
              />
            }
          />
        </div>
      );
    }
    
    // Broker exists but not logged in
    if (broker && !broker.loginStatus) {
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={<Lock className="w-8 h-8 text-sec-blue" />}
            title="Login Required"
            message="Please login to your broker account to view option chain details"
            actionButton={
              <Button 
                text="Go to Broker Page"
                variant="primary"
                onClick={() => navigate('/broker')}
                className="h-12 text-white rounded-lg"
              />
            }
          />
        </div>
      );
    }
    
    return <OptionChainData />;
  };

  return (
    <div className="flex-1 flex-col w-full border border-light-gray overflow-auto hide-scrollbar">
      {renderContent()}
    </div>
  );
};

export default OptionChain;