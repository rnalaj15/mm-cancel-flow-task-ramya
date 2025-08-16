import React from 'react';

interface SurveyQuestionProps {
  question: string;
  options: string[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  variant?: 'purple' | 'blue';
  underlineWord?: string;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  options,
  value,
  onChange,
  variant = 'purple',
  underlineWord
}) => {
  const processedQuestion = underlineWord 
    ? question.replace(underlineWord, `<u>${underlineWord}</u>`)
    : question;
    
  const selectedColor = variant === 'purple' 
    ? 'bg-purple-600 text-white border-purple-600' 
    : 'bg-blue-600 text-white border-blue-600';
    
  const unselectedColor = 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400';
  
  return (
    <div>
      <h4 
        className="text-[#41403D] font-medium mb-3 text-sm"
        dangerouslySetInnerHTML={{ __html: processedQuestion }}
      />
      <div className="grid grid-cols-4 gap-2">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(typeof value === 'string' ? option : index)}
            className={`py-2 px-2 lg:px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
              (typeof value === 'string' ? value === option : value === index)
                ? selectedColor
                : unselectedColor
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SurveyQuestion;
