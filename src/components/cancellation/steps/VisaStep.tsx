import React from 'react';
import { useCancellationContext } from '@/contexts/CancellationContext';
import Button from '../shared/Button';

const VisaStep: React.FC = () => {
  const {
    foundJobWithMigrateMate,
    hasImmigrationLawyer,
    visaType,
    setHasImmigrationLawyer,
    setVisaType,
    setCurrentStep,
    updateCancellation,
    markPendingCancellation
  } = useCancellationContext();
  
  const handleComplete = async () => {
    if (hasImmigrationLawyer !== null && visaType.trim()) {
      await updateCancellation({ has_immigration_lawyer: hasImmigrationLawyer, visa_type: visaType });
      await markPendingCancellation();
      setCurrentStep('completed');
    }
  };
  
  const isFormComplete = hasImmigrationLawyer !== null && visaType.trim().length > 0;
  
  return (
    <div className="space-y-6">
        <div>
          {foundJobWithMigrateMate === true ? (
            <h3 className="text-2xl font-bold text-[#41403D] mb-4">
              We helped you land the job, now let&apos;s help you secure your visa.
            </h3>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-[#41403D] mb-2">
                You landed the job!<br />
                <em>That&apos;s what we live for.</em>
              </h3>
              <h4 className="text-xl font-bold text-[#41403D] mb-4">
                Even if it wasn&apos;t through Migrate Mate, let us help get your visa sorted.
              </h4>
            </>
          )}
          
          <div className="mb-4">
            <p className="text-[#41403D] mb-2">
              Is your company providing an immigration lawyer to help with your visa?*
            </p>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="immigrationLawyer"
                  checked={hasImmigrationLawyer === true}
                  onChange={() => setHasImmigrationLawyer(true)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-[#41403D]">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="immigrationLawyer"
                  checked={hasImmigrationLawyer === false}
                  onChange={() => setHasImmigrationLawyer(false)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-[#41403D]">No</span>
              </label>
            </div>
          </div>

          {hasImmigrationLawyer === true && (
            <div className="mb-4">
              <label className="block text-[#41403D] mb-2">
                What visa will you be applying for?*
              </label>
              <input
                type="text"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                onBlur={() => {
                  if (!visaType.trim()) {
                    setHasImmigrationLawyer(null);
                  }
                }}
              />
            </div>
          )}
          
          {hasImmigrationLawyer === false && (
            <div className="mb-4">
              <label className="block text-[#41403D] mb-2">
                We can connect you with one of our trusted partners. Which visa would you like to apply for?*
              </label>
              <input
                type="text"
                value={visaType}
                onChange={(e) => setVisaType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                onBlur={() => {
                  if (!visaType.trim()) {
                    setHasImmigrationLawyer(null);
                  }
                }}
              />
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 mt-2"></div>

        <div className="pt-3">
          <Button
            onClick={handleComplete}
            disabled={!isFormComplete}
            variant="primary"
            fullWidth
          >
            Complete cancellation
          </Button>
        </div>
      </div>
  );
};

export default VisaStep;
