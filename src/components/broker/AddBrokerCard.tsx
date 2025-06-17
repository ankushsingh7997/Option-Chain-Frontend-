import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Plus, User } from 'lucide-react';
import { REGISTER_BROKER } from '../../graphql/broker/broker';
import { RegisterBrokerResponse, RegisterBrokerInput } from '../../graphql/broker/types';
import Button from '../ui/Button/Button';
import GeneralError from '../ui/general/GeneralError';
import { extractErrorMessage } from '../../apollo/error';
import { useToast } from '../../hooks/useToast';

interface AddBrokerCardProps {
  onBrokerAdded: (brokerData: any) => void;
  onCancel: () => void;
}

const AddBrokerCard: React.FC<AddBrokerCardProps> = ({ onBrokerAdded, onCancel }) => {
  const [actid, setActid] = useState('');
  const [error,setError]=useState('')
  const [isLoading, setIsLoading] = useState(false);
  const toast=useToast()

  const [registerBroker] = useMutation<RegisterBrokerResponse>(REGISTER_BROKER, {
    onCompleted: (data) => {
      if (data.registerBroker.status && data.registerBroker.data) {
        toast.success(data.registerBroker.message)
        onBrokerAdded(data.registerBroker.data);
      }
      setIsLoading(false);
    },

    onError: (error) => {
      const errorMessage = extractErrorMessage(error, 'Login failed');
      setError(errorMessage)
      setIsLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actid.trim()) return;

    setIsLoading(true);
    const input: RegisterBrokerInput = {
      actid: actid.trim(),
      broker: 'firstock'
    };

    await registerBroker({ variables: { input } });
  };

  const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setError("")
    setActid(e.target.value)
  }

  return (
    <div className="bg-background-3 backdrop-blur-lg border border-light-gray rounded-2xl p-8 h-[400px]">
      <div className="text-center mb-6 ">
        <div className="w-16 h-16 bg-sec-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-sec-blue" />
        </div>
        <h2 className="text-xl font-ibm font-bold text-white mb-2">Add Broker Account</h2>
        <p className="text-[#9A9A9A] font-montserrat">Enter your Firstock account ID to get started</p>
      </div>
      {error &&<GeneralError message={error}/>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white font-montserrat text-14 mb-2">
            Account ID
          </label>
          <input
            type="text"
            value={actid}
            onChange={handleInputChange}
            placeholder="Enter your account ID (e.g., AH0978)"
            className="w-full h-12 bg-elemental-gray border border-light-gray rounded-lg px-4 text-white font-montserrat placeholder-[#9A9A9A] focus:outline-none focus:border-sec-blue transition-colors"
            required
          />
        </div>

        <div className="flex space-x-4 pt-2">
          <Button
            type="button"
            text="Cancel"
            variant="secondary"
            onClick={onCancel}
            className="flex-1 h-12 text-[#9A9A9A] border border-light-gray hover:bg-elemental-gray rounded-lg font-ibm font-medium transition-colors"
          />
          <Button
            type="submit"
            text={isLoading ? "Adding..." : "Add Broker"}
            variant="primary"
            disabled={isLoading || !actid.trim()}
            className="flex-1 h-12 text-white bg-sec-blue hover:bg-[#3f59d8] disabled:bg-[#4B4C51] disabled:cursor-not-allowed rounded-lg font-ibm font-medium transition-colors"
          />
        </div>
      </form>
    </div>
  );
};

export default AddBrokerCard;