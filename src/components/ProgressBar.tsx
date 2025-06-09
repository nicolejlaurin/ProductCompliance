import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  stepTitles
}) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-white text-gray-600 border-2 border-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-sm mt-3 text-center max-w-24 leading-tight ${
                  isCurrent ? 'text-white font-semibold' : 'text-gray-300'
                }`}>
                  {title}
                </span>
              </div>
              {index < stepTitles.length - 1 && (
                <div
                  className={`h-1 w-20 mx-6 transition-all duration-300 rounded-full ${
                    stepNumber < currentStep ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-white/20'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};