import React from 'react';
import Image from 'next/image';
import { useCancellationContext } from '@/contexts/CancellationContext';
import { RamyaStepIndicator } from '../shared';
import { RamyaButton } from '../shared';

interface RamyaCompletedStepProps {
  onClose: () => void;
}

const RamyaCompletedStep: React.FC<RamyaCompletedStepProps> = ({ onClose }) => {
  const {
    cancellationReason,
    foundJobWithMigrateMate,
    goBack
  } = useCancellationContext();
  
  const renderContent = () => {
    // "Not yet" flow completion
    if (cancellationReason) {
      return (
        <>
          <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-4">
            Sorry to see you go, mate.
          </h3>
          <p className="text-xl font-semibold text-[#41403D] leading-normal mb-8">
            Thanks for being with us, and you&apos;re<br />
            always welcome back.
          </p>
          <div className="space-y-2 mb-8">
            <p className="text-base text-[#62605C] font-bold mb-0">
              Your subscription is set to end on XX date.
            </p>
            <p className="text-base text-[#62605C] font-bold">
              You&apos;ll still have full access until then. No further charges after that.
            </p>
          </div>
          <p className="text-base text-[#41403D] mb-2">
            Changed your mind? You can reactivate anytime before your end date.
          </p>
        </>
      );
    }
    
    // "Yes" flow - found job WITH MigrateMate
    if (foundJobWithMigrateMate === true) {
      return (
        <>
          <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-0">
            All done, your cancellation&apos;s been processed.
          </h3>
          <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-6">
            been processed.
          </h3>
          <p className="text-[#41403D] leading-relaxed font-semibold">
            We&apos;re stoked to hear you&apos;ve landed a job and sorted your visa. 
          </p>
          <p className="text-[#41403D] leading-relaxed mb-8 font-semibold">
            Big congrats from the team. 🙌
          </p>
        </>
      );
    }
    
    // "Yes" flow - found job but NOT with MigrateMate
    return (
      <>
        <h3 className="text-3xl font-bold text-[rgb(65,64,61)] leading-tight mb-2">
          Your cancellation&apos;s all sorted, mate,
        </h3>
        <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-8">
          no more charges.
        </h3>
        
        {/* Profile Section */}
        <div className="mb-6">
          <div className="flex flex-col mb-4 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <Image 
                  src="/mihailo-profile.jpeg" 
                  alt="Mihailo Bozic"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-[#41403D]">Mihailo Bozic</div>
                <div className="text-[#41403D] text-sm">&lt;mihailo@migratemate.co&gt;</div>
              </div>
            </div>
            <div className="space-y-4 mt-2 pl-10">
              <p className="text-[#41403D] text-base font-bold">
                I&apos;ll be reaching out soon to help with the visa side of things.
              </p>
              <p className="text-[#41403D] text-base">
                We&apos;ve got your back, whether it&apos;s questions, paperwork, or just<br />
                figuring out your options.
              </p>
              <p className="text-[#41403D] text-base font-semibold">
                Keep an eye on your inbox, I&apos;ll be in touch <u>shortly</u>.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={goBack}
          className="flex items-center text-[#41403D] hover:text-[#41403D]"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-black">Subscription Cancelled</h2>
            <RamyaStepIndicator currentStep={0} totalSteps={3} showLabel={true} />
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Content */}
        <div className="flex-1 p-8 pr-6">
          <div className="space-y-6">
            <div>{renderContent()}</div>
            <div className="border-t border-gray-200"></div>
            
            <RamyaButton
              onClick={onClose}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              {cancellationReason ? 'Back to Jobs' : 'Finish'}
            </RamyaButton>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-[400px] h-auto relative overflow-hidden rounded-2xl m-5">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Image on top */}
        <div className="h-48 relative overflow-hidden rounded-t-2xl">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content below */}
        <div className="p-6">
          <div className="space-y-6">
            <div>
              {renderContent()}
            </div>
            <RamyaButton
              onClick={onClose}
              variant="primary"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700"
            >
              {cancellationReason ? 'Back to Jobs' : 'Finish'}
            </RamyaButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default RamyaCompletedStep;
