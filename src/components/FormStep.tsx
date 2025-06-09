import React from 'react';

interface FormStepProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const FormStep: React.FC<FormStepProps> = ({ 
  children, 
  title, 
  description, 
  className = '' 
}) => {
  return (
    <div className={`animate-fadeIn ${className}`}>
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
        {description && (
          <p className="text-gray-200 text-lg">{description}</p>
        )}
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        {children}
      </div>
    </div>
  );
};