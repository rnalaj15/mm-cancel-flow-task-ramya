import React from 'react';
import { useCancellationContext } from '@/contexts/CancellationContext';
import { RamyaButton } from '../shared';
import { formatCurrency } from '@/utils/cancellation';

const RamyaDownsellStep: React.FC = () => {
  const {
    setAcceptedDownsell,
    setCurrentStep,
    getDownsellDisplay
  } = useCancellationContext();
  
  const { originalPrice, downsellPrice } = getDownsellDisplay();
  
  const handleAcceptDownsell = () => {
    setAcceptedDownsell(true);
    setCurrentStep('downsell_completed');
  };
  
  const handleDeclineDownsell = () => {
    setAcceptedDownsell(false);
    setCurrentStep('survey');
  };
  
  return (
    <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#41403D] mb-4">
            We built this to help you land the job, this makes it a little easier.
          </h3>
          <p className="text-[#41403D] mb-6">
            We&apos;ve been there and we&apos;re here to help you.
          </p>
        </div>

        {/* Downsell Offer Box */}
        <div className="bg-purple-100 border-2 border-purple-200 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h4 className="text-lg font-bold text-[#41403D] mb-4">
              Here&apos;s <u className="text-[#41403D]">50% off</u> until you find a job.
            </h4>
            <div className="flex items-baseline justify-center space-x-3 mb-4">
              <span className="text-3xl font-bold text-purple-600">
                {formatCurrency(downsellPrice)}/month
              </span>
              <span className="text-lg text-gray-500 line-through">
                {formatCurrency(originalPrice)}/month
              </span>
            </div>
            <RamyaButton
              onClick={handleAcceptDownsell}
              variant="success"
              fullWidth
              className="mb-3"
            >
              Get 50% off
            </RamyaButton>
            <p className="text-sm text-[#41403D] italic">
              You won&apos;t be charged until your next billing date.
            </p>
          </div>
        </div>

        {/* No Thanks Button */}
        <RamyaButton
          onClick={handleDeclineDownsell}
          variant="secondary"
          fullWidth
        >
          No thanks
        </RamyaButton>
      </div>
  );
};

export default RamyaDownsellStep;
