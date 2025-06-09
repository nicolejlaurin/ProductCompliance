import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required = false
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-white mb-4">
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      
      <div className="space-y-3">
        {options.map((option) => (
          <div
            key={option.value}
            className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/20 backdrop-blur-sm ${
              value === option.value
                ? 'border-blue-400 bg-blue-500/20 ring-2 ring-blue-400/50'
                : 'border-white/30 bg-white/10'
            }`}
            onClick={() => onChange(option.value)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="mt-1 text-blue-500 focus:ring-blue-400 bg-white/90"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-white">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-gray-200 mt-1">
                    {option.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-300 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};