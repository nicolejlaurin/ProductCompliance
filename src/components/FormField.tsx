import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  rows
}) => {
  const baseInputClasses = `w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-500 ${
    error ? 'border-red-400 bg-red-50/90' : 'border-white/30 focus:border-blue-400'
  }`;

  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-semibold text-white mb-3">
        {label} {required && <span className="text-red-300">*</span>}
      </label>
      
      {type === 'select' && options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={baseInputClasses}
          required={required}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className={baseInputClasses}
          required={required}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClasses}
          required={required}
        />
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-300 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};