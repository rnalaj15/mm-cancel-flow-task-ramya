import React from 'react';
import { useCancellationContext } from '@/contexts/CancellationContext';

const ReasonSelectionStep: React.FC = () => {
  const {
    cancellationReason,
    reasonFollowUpText,
    setCancellationReason,
    setReasonFollowUpText,
    setAcceptedDownsell,
    setCurrentStep,
    updateCancellation,
    markPendingCancellation
  } = useCancellationContext();
  
  const handleCompleteClick = async () => {
    if (isReasonFollowUpComplete()) {
      await updateCancellation({
        reason: cancellationReason,
        feedback: reasonFollowUpText
      });
      await markPendingCancellation();
      setCurrentStep('completed');
    }
  };
 
  const handleGetDiscount = async () => {
    setAcceptedDownsell(true);
    await updateCancellation({ accepted_downsell: true });
    setCurrentStep('downsell_completed');
  };
  
  const isReasonFollowUpComplete = () => {
    if (!cancellationReason) return false;
    
    if (cancellationReason === 'Too expensive') {
      return reasonFollowUpText.trim().length > 0; // Any amount entered
    } else {
      return reasonFollowUpText.trim().length >= 25; // Minimum 25 characters for textareas
    }
  };
  
  const renderFollowUpQuestion = () => {
    switch (cancellationReason) {
      case 'Too expensive':
        return (
          <>
            <p className="text-[#41403D] font-medium mb-3">
              What would be the maximum you would be willing to pay?*
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#41403D]">$</span>
              <input
                type="text"
                placeholder=""
                value={reasonFollowUpText}
                onChange={(e) => setReasonFollowUpText(e.target.value)}
                className="w-full pl-6 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </>
        );
        
      case 'Platform not helpful':
        return (
          <>
            <p className="text-[#41403D] font-medium mb-3">
              What can we change to make the platform more helpful?*
            </p>
            <p className="text-red-500 text-sm mb-3">
              Please enter at least 25 characters so we can understand your feedback*
            </p>
            <textarea
              placeholder=""
              rows={4}
              value={reasonFollowUpText}
              onChange={(e) => setReasonFollowUpText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              Min 25 characters ({reasonFollowUpText.length}/25)
            </p>
          </>
        );
        
      case 'Not enough relevant jobs':
        return (
          <>
            <p className="text-[#41403D] font-medium mb-3">
              In which way can we make the jobs more relevant?*
            </p>
            <textarea
              placeholder=""
              rows={4}
              value={reasonFollowUpText}
              onChange={(e) => setReasonFollowUpText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              Min 25 characters ({reasonFollowUpText.length}/25)
            </p>
          </>
        );
        
      case 'Decided not to move':
        return (
          <>
            <p className="text-[#41403D] font-medium mb-3">
              What changed for you to decide to not move?*
            </p>
            <textarea
              placeholder=""
              rows={4}
              value={reasonFollowUpText}
              onChange={(e) => setReasonFollowUpText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              Min 25 characters ({reasonFollowUpText.length}/25)
            </p>
          </>
        );
        
      case 'Other':
        return (
          <>
            <p className="text-[#41403D] font-medium mb-3">
              What would have helped you the most?*
            </p>
            <textarea
              placeholder=""
              rows={4}
              value={reasonFollowUpText}
              onChange={(e) => setReasonFollowUpText(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
            />
            <p className="text-sm text-gray-500 text-right mt-1">
              Min 25 characters ({reasonFollowUpText.length}/25)
            </p>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex-1 p-8 pr-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-2">
            What&apos;s the main reason for cancelling?
          </h3>
          <p className="text-[#41403D] text-sm mb-4">
            Please take a minute to let us know why:
          </p>
          {!cancellationReason && (
            <p className="text-red-500 text-sm mb-6">
              To help us understand your experience, please select a reason for cancelling*
            </p>
          )}
        </div>

        {/* Radio Button Options */}
        <div className="space-y-4 mb-8">
          {!cancellationReason ? (
            // Show all options when none selected
            [
              'Too expensive',
              'Platform not helpful',
              'Not enough relevant jobs',
              'Decided not to move',
              'Other'
            ].map((reason) => (
              <label key={reason} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="cancellation_reason"
                  value={reason}
                  checked={cancellationReason === reason}
                  onChange={(e) => {
                    setCancellationReason(e.target.value);
                    setReasonFollowUpText(''); // Reset follow-up text when changing reason
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-[#41403D] font-medium">{reason}</span>
              </label>
            ))
          ) : (
            // Show only selected option and follow-up
            <div className="space-y-4">
              <label className="flex items-center cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="cancellation_reason"
                    value={cancellationReason}
                    checked={true}
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 opacity-0"
                  />
                  {/* Custom checked state indicator - perfectly positioned */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gray-800 border border-gray-800 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="ml-3 text-[#41403D] font-medium">{cancellationReason}</span>
              </label>
              
              {/* Follow-up question based on selection */}
              <div className="mt-4">
                {renderFollowUpQuestion()}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGetDiscount}
            className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
          >
            Get 50% off | $12.50 <span className="text-green-200 line-through">$25</span>
          </button>
          <button
            onClick={handleCompleteClick}
            disabled={!isReasonFollowUpComplete()}
            className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${
              isReasonFollowUpComplete()
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-200 text-[#41403D] cursor-not-allowed opacity-60'
            }`}
          >
            Complete cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonSelectionStep;