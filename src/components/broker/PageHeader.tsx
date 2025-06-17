interface PageHeaderProps {
    title: string;
    subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => (
    <div className="text-center mb-8">
        <h1 className="text-32 font-ibm font-bold text-white mb-2">{title}</h1>
        <p className="text-[#9A9A9A] font-montserrat">{subtitle}</p>
    </div>
);


export default PageHeader