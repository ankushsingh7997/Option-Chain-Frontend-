import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    iconColor?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
    icon: Icon, 
    label, 
    value, 
    iconColor = "text-sec-blue" 
}) => (
    <div className="bg-elemental-gray rounded-lg p-4">
        <div className="flex items-center space-x-3">
            <Icon className={`w-5 h-5 ${iconColor}`} />
            <div>
                <p className="text-[#9A9A9A] font-montserrat text-12">{label}</p>
                <p className="text-white font-ibm font-medium">{value}</p>
            </div>
        </div>
    </div>
);


export default InfoCard