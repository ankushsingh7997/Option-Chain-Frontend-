import React, { useState } from 'react';
import { User } from 'lucide-react';
import Button from '../ui/Button/Button';
import AddBrokerCard from '../broker/AddBrokerCard';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  showAddBroker?: boolean;
  onBrokerAdded?: (brokerData: any) => void;
  actionButton?: React.ReactNode;
  buttonText?: string; 
  buttonVariant?: 'primary' | 'secondary'; 
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  showAddBroker = false,
  onBrokerAdded,
  actionButton,
  buttonText = "Add Broker", 
  buttonVariant = "primary" 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  if (showAddForm && showAddBroker) {
    return (
      <AddBrokerCard 
        onBrokerAdded={(brokerData) => {
          onBrokerAdded?.(brokerData);
          setShowAddForm(false);
        }}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  // Determine button styling based on variant and button text
  const getButtonClassName = () => {
    if (buttonText.toLowerCase().includes('login') || buttonText.toLowerCase().includes('go to broker')) {
      return "h-12 text-white bg-orange-500 hover:bg-orange-600 rounded-lg font-ibm font-medium transition-colors px-8";
    }
    return "h-12 text-white bg-sec-blue hover:bg-[#3f59d8] rounded-lg font-ibm font-medium transition-colors px-8";
  };

  return (
    <div className="bg-background-3 backdrop-blur-lg border border-light-gray rounded-2xl p-8 text-center">
      <div className="w-16 h-16 bg-sec-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon || <User className="w-8 h-8 text-sec-blue" />}
      </div>
      <h2 className="text-xl font-ibm font-bold text-white mb-2">{title}</h2>
      <p className="text-[#9A9A9A] font-montserrat mb-6">{message}</p>
      
      {showAddBroker ? (
        <Button
          text={buttonText}
          variant={buttonVariant}
          onClick={() => setShowAddForm(true)}
          className={getButtonClassName()}
        />
      ) : (
        actionButton
      )}
    </div>
  );
};

export default EmptyState;