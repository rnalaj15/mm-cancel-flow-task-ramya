import React from 'react';
import { useCancellationContext } from '@/contexts/CancellationContext';

const SurveyStep: React.FC = () => {
  const {
    rolesAppliedSurvey,
    companiesEmailedSurvey,
    companiesInterviewedSurvey,
    setRolesAppliedSurvey,
    setCompaniesEmailedSurvey,
    setCompaniesInterviewedSurvey,
    setAcceptedDownsell,
    setCurrentStep,
    updateCancellation,
    getDownsellDisplay
  } = useCancellationContext();
  
  const isFormComplete = rolesAppliedSurvey !== null && 
                        companiesEmailedSurvey !== null && 
                        companiesInterviewedSurvey !== null;
  
  const handleGetDiscount = async () => {
    setAcceptedDownsell(true);
    await updateCancellation({ accepted_downsell: true });
    setCurrentStep('downsell_completed');
  };
  
  const handleContinue = async () => {
    if (isFormComplete) {
      await updateCancellation({
        roles_applied: rolesAppliedSurvey,
        companies_emailed: companiesEmailedSurvey,
        companies_interviewed: companiesInterviewedSurvey
      });
      setCurrentStep('reason_selection');
    }
  };
  
  return (
    <div className="flex-1 p-8 pr-6">
      <div className="space-y-5">
        <div>
          <h3 className="text-[28px] font-bold text-[#41403D] leading-tight mb-4">
            Help us understand how you were using Migrate Mate.
          </h3>
        </div>

        {/* Question 1: Roles Applied */}
        <div className="mb-4">
          <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many roles did you <u>apply</u> for through Migrate Mate?</h4>
          <div className="grid grid-cols-4 gap-3">
            {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
              <button
                key={option}
                onClick={() => setRolesAppliedSurvey(option)}
                className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                  rolesAppliedSurvey === option
                    ? 'bg-[#8952fc] text-white border-[#8952fc]'
                    : 'bg-white text-[#41403D] border-gray-300 hover:border-[#8952fc]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: Companies Emailed */}
        <div className="mb-4">
          <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many companies did you <u>email</u> directly?</h4>
          <div className="grid grid-cols-4 gap-3">
            {['0', '1-5', '6-20', '20+'].map((option) => (
              <button
                key={option}
                onClick={() => setCompaniesEmailedSurvey(option)}
                className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                  companiesEmailedSurvey === option
                    ? 'bg-[#8952fc] text-white border-[#8952fc]'
                    : 'bg-white text-[#41403D] border-gray-300 hover:border-[#8952fc]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3: Companies Interviewed */}
        <div className="mb-6">
          <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many different companies did you <u>interview</u> with?</h4>
          <div className="grid grid-cols-4 gap-3">
            {['0', '1-2', '3-5', '5+'].map((option) => (
              <button
                key={option}
                onClick={() => setCompaniesInterviewedSurvey(option)}
                className={`py-2.5 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                  companiesInterviewedSurvey === option
                    ? 'bg-[#8952fc] text-white border-[#8952fc]'
                    : 'bg-white text-[#41403D] border-gray-300 hover:border-[#8952fc]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGetDiscount}
            className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            {(() => { const { originalPrice, downsellPrice } = getDownsellDisplay(); return `Get 50% off | $${downsellPrice} `; })()} <span className="text-green-200 line-through">{(() => { const { originalPrice } = getDownsellDisplay(); return `$${originalPrice}`; })()}</span>
          </button>
          <button
            onClick={handleContinue}
            disabled={!isFormComplete}
            className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${
              isFormComplete
                ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                : 'bg-gray-200 text-[#41403D] cursor-not-allowed opacity-60'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyStep;