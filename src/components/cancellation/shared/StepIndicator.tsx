import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps,
  showLabel = true 
}) => {
  // For completed state, show all green rectangles
  const isCompleted = currentStep === 0;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-2 rounded-sm transition-colors ${
              isCompleted || i < currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600">
          {isCompleted ? 'Completed' : `Step ${currentStep} of ${totalSteps}`}
        </span>
      )}
    </div>
  );
};

export default StepIndicator;
