
import { AppDispatch } from '../store'; 
import { clearBrokerData } from '../store/slices/brokerSlice';
import { disconnect } from '../store/slices/websocketSlice'; 
import { clearOptionChain } from '../store/slices/optionChainSlice'; 
import { websocketService } from '../services/websocketService';

// Action creator to clear all broker-related data
export const clearAllBrokerData = () => {
    websocketService.disconnect()
    return (dispatch: AppDispatch) => {
        // Clear broker data
        dispatch(clearBrokerData());
        
        // Disconnect and clear websocket data
        dispatch(disconnect());
        
        // Clear option chain data
        dispatch(clearOptionChain());
    };
};