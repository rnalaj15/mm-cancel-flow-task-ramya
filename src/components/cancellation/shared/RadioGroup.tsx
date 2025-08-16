import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[] | string[];
  value: string | null;
  onChange: (value: string) => void;
  className?: string;
  customStyle?: boolean;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className = '',
  customStyle = false
}) => {
  // Normalize options to RadioOption format
  const normalizedOptions: RadioOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {normalizedOptions.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer">
          {customStyle ? (
            <div className="relative flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 opacity-0"
              />
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-800 border border-gray-800 rounded-full flex items-center justify-center">
                {value === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          ) : (
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
            />
          )}
          <span className="ml-3 text-[#41403D] font-medium">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
