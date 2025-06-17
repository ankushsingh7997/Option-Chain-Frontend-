import React from 'react';
import { Shield } from 'lucide-react';
import Button from '../Button/Button';
interface FallBackPageProps {
    title?: string;
    message?: string;
    error?: string;
    handleRefresh?: () => void;
    buttonText?: string;
    icon?: React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

const FallBackPage: React.FC<FallBackPageProps> = ({
    title = "Error Loading Data",
    message = "Something went wrong while loading the data.",
    error,
    handleRefresh,
    buttonText = "Try Again",
    icon,
    iconBgColor = "bg-red-500/20",
    iconColor = "text-red-400"
}) => {
    const displayMessage = error || message;
    const displayIcon = icon || <Shield className={`w-8 h-8 ${iconColor}`} />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#010e1e] via-[#0a1829] to-[#010e1e] flex items-center justify-center p-4">
            <div className="bg-background-3 backdrop-blur-lg border border-light-gray rounded-2xl p-8 max-w-md w-full text-center">
                <div className={`w-16 h-16 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {displayIcon}
                </div>
                <h2 className="text-xl font-ibm font-bold text-white mb-2">{title}</h2>
                <p className="text-[#9A9A9A] font-montserrat mb-6">
                    {displayMessage}
                </p>
                {handleRefresh && (
                    <Button
                        text={buttonText}
                        variant="primary"
                        onClick={handleRefresh}
                        className="w-full h-12 text-white bg-sec-blue hover:bg-[#3f59d8] rounded-lg font-ibm font-medium transition-colors"
                    />
                )}
            </div>
        </div>
    );
};

export default FallBackPage;