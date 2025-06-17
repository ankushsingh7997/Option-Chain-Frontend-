import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  label?: string;
  error?: string;
  container?: string;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  iconPosition = "left",
  label,
  error,
  container = "",
  inputClassName = "",
  className,
  ...props
}) => {
  return (
    <div className={`w-full ${container}`}>
      {label && (
        <label className="block mb-1 text-sm font-medium text-white">
          {label}
        </label>
      )}

      <div
        className={`
          flex items-center px-3 py-1 rounded-md border transition-all duration-200
          ${error ? "border-loss text-loss" : "border-[rgba(240,240,240,0.1)] text-white"}
        `}
      >
        {icon && iconPosition === "left" && (
          <span className="mr-2 flex-shrink-0">{icon}</span>
        )}

        <input
          className={`
            w-full bg-inherit outline-none text-white placeholder:text-gray-400
            font-montserrat text-font-14
            ${inputClassName}
          `}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <span className="ml-2 flex-shrink-0">{icon}</span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-loss font-medium">{error}</p>}
    </div>
  );
};

export default Input;
