import React from 'react';

import BackGroundTheme from '../components/ui/Theme/BackgroundTheme';
import FallBackPage from '../components/ui/general/FallBackPage';
import BrokerCard from '../components/broker/BrokerCard';
import EmptyState from '../components/broker/EmptyState';
import Header from '../components/layout/Header';
import { useBrokerData } from '../hooks/useBrokerData';

const BrokerPage: React.FC = () => {
    const {brokerData,error,fetchBrokers,updateBrokerData,hasData,hasError} = useBrokerData({ fetchPolicy: 'immediate',
        onSuccess: (data) => {
            console.log(data, "Broker data loaded successfully");
        },
        onError: (error) => {
            console.error('Failed to load broker data:', error);
        }
    });

    const handleRefresh = () => {
    fetchBrokers()
    };

    const handleBrokerAdded = (newBrokerData: any) => {
        updateBrokerData(newBrokerData);
        fetchBrokers();
    };


    if (hasError) {
        return (
            <FallBackPage 
                title="Error Loading Broker" 
                error={error} 
                handleRefresh={handleRefresh} 
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#010e1e] via-[#0a1829] to-[#010e1e] flex flex-col gap-4 items-center">
            <BackGroundTheme />
            <Header page="Broker" />
            <div className="relative z-10 max-w-2xl mx-auto ">
                {hasData && brokerData ? (
                    <BrokerCard brokerData={brokerData} onRefresh={handleRefresh} />
                ) : (
                    <EmptyState
                        title="No Broker Found"
                        message="No broker account is currently associated with your profile."
                        showAddBroker={true}
                        onBrokerAdded={handleBrokerAdded}
                    />
                )}
            </div>
        </div>
    );
};

export default BrokerPage;