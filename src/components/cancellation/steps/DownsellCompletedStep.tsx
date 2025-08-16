import React from 'react';
import Image from 'next/image';
import { useCancellationContext } from '@/contexts/CancellationContext';
import { RamyaStepHeader } from '../shared';
import { RamyaButton } from '../shared';
import { getDownsellPrice, formatCurrency } from '@/utils/cancellation';
import { MOCK_SUBSCRIPTION } from '@/constants/cancellation';

interface RamyaDownsellCompletedStepProps {
  onClose: () => void;
}

const RamyaDownsellCompletedStep: React.FC<RamyaDownsellCompletedStepProps> = ({ onClose }) => {
  const {
    acceptedDownsell,
    setCurrentStep
  } = useCancellationContext();
  
  const downsellPrice = getDownsellPrice(MOCK_SUBSCRIPTION.monthly_price);
  const originalPrice = MOCK_SUBSCRIPTION.monthly_price / 100;
  
  const handleLandDreamRole = () => {
    setCurrentStep('job_recommendations');
  };
  
  return (
    <>
      <RamyaStepHeader
        title="Subscription"
        onClose={onClose}
        centerTitle={true}
      />
      <div className="hidden lg:flex">
        <div className="flex-1 p-8 pr-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[#41403D] mb-4">
                Great choice, mate!
              </h3>
              <div className="mb-6">
                <p className="text-[#41403D] mb-2 font-bold">
                  You&apos;re still on the path to your dream role.{' '}
                  <span className="text-purple-600 font-bold">
                    Let&apos;s make it happen together!
                  </span>
                </p>
              </div>
              <div className="mb-6">
                <p className="text-[#62605C] text-sm mb-0 font-bold">
                  You&apos;ve got XX days left on your current plan.
                </p>
                <p className="text-[#62605C] text-sm mb-2 font-bold">
                  Starting from XX date, your monthly payment will be {formatCurrency(acceptedDownsell ? downsellPrice : originalPrice)}.
                </p>
                <p className="text-[#62605C] text-sm italic">
                  You can cancel anytime before then.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200"></div>
            <RamyaButton
              onClick={handleLandDreamRole}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              Land your dream role
            </RamyaButton>
          </div>
        </div>
        <div className="w-[400px] relative overflow-hidden rounded-2xl mr-5 self-start" style={{ height: '270px', marginTop: '25px' }}>
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      <div className="lg:hidden">
        <div className="h-48 relative overflow-hidden rounded-2xl mt-2 mx-5">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#41403D] leading-tight mb-3">
                Great choice, mate!
              </h3>
              <div className="mb-3">
                <p className="text-[#41403D] text-sm mb-2">
                  You&apos;re still on the path to your dream role.{' '}
                  <span className="text-purple-600 font-semibold">
                    Let&apos;s make it happen together!
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <p className="text-[#41403D] text-xs mb-1">
                  You&apos;ve got XX days left on your current plan.
                </p>
                <p className="text-[#41403D] text-xs mb-1">
                  Starting from XX date, your monthly payment will be {formatCurrency(acceptedDownsell ? downsellPrice : originalPrice)}.
                </p>
                <p className="text-[#41403D] text-xs italic">
                  You can cancel anytime before then.
                </p>
              </div>
            </div>
            <RamyaButton
              onClick={handleLandDreamRole}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              Land your dream role
            </RamyaButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default RamyaDownsellCompletedStep;
