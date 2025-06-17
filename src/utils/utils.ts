
import { AppDispatch } from '../store'; 
import { clearBrokerData } from '../store/slices/brokerSlice';
import { disconnect } from '../store/slices/websocketSlice'; 
import { clearOptionChain } from '../store/slices/optionChainSlice'; 

// Action creator to clear all broker-related data
export const clearAllBrokerData = () => {
    return (dispatch: AppDispatch) => {
        // Clear broker data
        dispatch(clearBrokerData());
        
        // Disconnect and clear websocket data
        dispatch(disconnect());
        
        // Clear option chain data
        dispatch(clearOptionChain());
        
        console.log('All broker-related data cleared');
    };
};