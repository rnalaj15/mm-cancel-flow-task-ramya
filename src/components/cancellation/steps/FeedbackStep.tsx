import React from 'react';
import { useCancellationContext } from '@/contexts/CancellationContext';
import { RamyaButton } from '../shared';
import { RamyaTextArea } from '../shared';
import { MIN_FEEDBACK_LENGTH } from '@/constants/cancellation';

const RamyaFeedbackStep: React.FC = () => {
  const {
    feedback,
    setFeedback,
    setCurrentStep,
    updateCancellation
  } = useCancellationContext();
  
  const handleContinue = async () => {
    if (feedback.length >= MIN_FEEDBACK_LENGTH) {
      await updateCancellation({ feedback });
      setCurrentStep('visa');
    }
  };
  
  return (
    <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#41403D] mb-4">
            What&apos;s one thing you wish we could&apos;ve helped you with?
          </h3>
          <p className="text-[#41403D] mb-6">
            We&apos;re always looking to improve, your thoughts can help us make MigrateMate more useful for others.*
          </p>
        </div>
        <RamyaTextArea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback..."
          rows={4}
          className="h-40"
          showCharCount
          minLength={MIN_FEEDBACK_LENGTH}
        />
        <RamyaButton
          onClick={handleContinue}
          disabled={feedback.length < MIN_FEEDBACK_LENGTH}
          variant="primary"
          fullWidth
        >
          Continue
        </RamyaButton>
      </div>
  );
};

export default RamyaFeedbackStep;
