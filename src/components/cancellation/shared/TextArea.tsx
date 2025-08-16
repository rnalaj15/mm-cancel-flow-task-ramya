import React from 'react';

interface RamyaTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showCharCount?: boolean;
  minLength?: number;
  helperText?: string;
}

const RamyaTextArea: React.FC<RamyaTextAreaProps> = ({
  label,
  error,
  showCharCount = false,
  minLength,
  helperText,
  value = '',
  className = '',
  ...props
}) => {
  const textLength = String(value).length;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[#41403D] font-medium mb-3">
          {label}
        </label>
      )}

      <textarea
        value={value}
        className={`
          w-full px-3 py-3
          border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          resize-none text-black
          ${className}
        `.trim()}
        {...props}
      />

      {helperText && (
        <div className="text-sm text-gray-500 mt-1">{helperText}</div>
      )}

      {error && (
        <div className="text-sm text-red-500 mt-1">{error}</div>
      )}

      {showCharCount && minLength && (
        <div className="text-sm text-gray-500 text-right mt-1">
          Min {minLength} characters ({textLength}/{minLength})
        </div>
      )}
    </div>
  );
};

export default RamyaTextArea;
