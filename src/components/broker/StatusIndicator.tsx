interface StatusIndicatorProps {
    isActive?: boolean;
    activeText?: string;
    inactiveText?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
    isActive, 
    activeText = "Connected", 
    inactiveText = "Disconnected" 
}) => (
    <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span className={`font-montserrat text-14 ${isActive ? 'text-green-400' : 'text-red-400'}`}>
            {isActive ? activeText : inactiveText}
        </span>
    </div>
);


export default StatusIndicator