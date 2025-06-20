import React, { CSSProperties, ReactElement } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  prefix?: string;
  prefixElement?: ReactElement;
  suffix?: string;
  suffixElement?: ReactElement;
  onClick?: () => void;
  style?: CSSProperties;
  variant?: "primary" | "secondary" | "success" | "error";
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text = "Click Me",
  prefix,
  prefixElement,
  suffix,
  suffixElement,
  onClick = () => {},
  style = {},
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = [
    "inline-flex items-center justify-center",
    "font-ibm font-medium text-font-16",
    "h-[30px] px-3 py-1",
    "shadow-shadow-1",
    "transition-colors duration-300 ease-in-out",
    "whitespace-nowrap", 
    "min-w-fit", 
    disabled ? "cursor-not-allowed" : "cursor-pointer",
  ];

  const variantClasses: Record<string, string> = {
    primary: "bg-pri-blue text-white hover:bg-sec-blue",
    secondary: "bg-sec-gray text-white hover:bg-gray-light",
    success: "bg-profit text-white hover:bg-profit-light",
    error: "bg-loss text-white hover:bg-loss-light",
  };

  const disabledClasses = "bg-gray-lighter text-sec-gray hover:bg-gray-lighter";

  const finalClasses = [
    ...baseClasses,
    disabled ? disabledClasses : variantClasses[variant] || variantClasses.primary,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={finalClasses}
      onClick={disabled ? undefined : onClick}
      style={style}
      disabled={disabled}
      {...props}
    >
      {(prefix || prefixElement) && (
        <span className="mr-2 inline-flex max-xs:mr-0">
          {prefixElement ? (
            prefixElement
          ) : (
            <img
              src={prefix!}
              alt="prefix"
              width={20}
              style={{ height: "0.85rem" }}
            />
          )}
        </span>
      )}

      <span>{text}</span>

      {(suffix || suffixElement) && (
        <span className="ml-2 inline-flex">
          {suffixElement ? (
            suffixElement
          ) : (
            <img
              src={suffix!}
              alt="suffix"
              width={20}
              style={{ height: "0.85rem" }}
            />
          )}
        </span>
      )}
    </button>
  );
};

export default Button;
