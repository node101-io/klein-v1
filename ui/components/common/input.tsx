import React from "react";

interface InputProps {
  label?: string;
  helperText?: string;
  name: string;
  value?: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  helperText,
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex max-w-[400px] flex-col">
      {label && (
        <label
          htmlFor={name}
          className="mb-1 text-sm font-medium text-[#525252]"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="flex h-12  py-[15px] px-4 items-start gap-4 rounded-md text-[#525252] bg-white border-b border-0 focus:outline-none focus:ring-0 border-[#8D8D8D] focus:border-[#5964FA]"
      />
      {helperText && (
        <p className="mt-1 text-sm text-[#525252]">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
