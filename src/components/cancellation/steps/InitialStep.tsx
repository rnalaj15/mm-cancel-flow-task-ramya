import React from 'react';
import Image from 'next/image';
import { useCancellationContext } from '@/contexts/CancellationContext';
import Button from '../shared/Button';

interface InitialStepProps {
  onClose: () => void;
}

const InitialStep: React.FC<InitialStepProps> = ({ onClose }) => {
  const { 
    setCurrentStep, 
    setFoundJobWithMigrateMate, 
    getDownsellVariant,
    setHasFoundJob 
  } = useCancellationContext();
  
  const handleFoundJob = () => {
    setHasFoundJob(true);
    setCurrentStep('congrats');
  };
  
  const handleNotYet = () => {
    setFoundJobWithMigrateMate(false);
    const variant = getDownsellVariant();
    if (variant === 'B') {
      setCurrentStep('downsell');
    } else {
      onClose(); // Variant A - redirect to profile page
    }
  };
  
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <h2 className="text-lg font-bold text-black flex-1 text-center">Subscription Cancellation</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="border-t border-gray-200"></div>
      
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Left Content */}
        <div className="flex-1 p-8 pr-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-4">
                Hey mate,<br />
                Quick one before you go.
              </h3>
              <div className="flex items-center mb-6">
                <h3 className="text-3xl font-bold text-[#41403D] leading-tight mb-4 italic">
                  Have you found a job yet?
                </h3>
              </div>
              <p className="text-[#41403D] leading-relaxed font-bold">
                Whatever your answer, we just want to help you take the next step. 
                With visa support, or by hearing how we can do better.
              </p>
            </div>
            <div className="border-t border-gray-200"></div>
            
            <div className="space-y-3">
              <Button
                onClick={handleFoundJob}
                variant="secondary"
                fullWidth
                className="font-bold"
              >
                Yes, I&apos;ve found a job
              </Button>
              <Button
                onClick={handleNotYet}
                variant="secondary"
                fullWidth
                className="font-bold"
              >
                Not yet - I&apos;m still looking
              </Button>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-[400px] h-[373px] relative overflow-hidden rounded-2xl m-5 mt-10">
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
        <div className="h-48 relative overflow-hidden rounded-2xl m-5">
          <Image
            src="/empire-state-compressed.jpg"
            alt="New York City skyline with Empire State Building"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content below */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#41403D] leading-tight mb-3">
                Hey mate,<br />
                Quick one before you go.
              </h3>
              <p className="text-lg text-[#41403D] italic font-medium mb-3">
                Have you found a job yet?
              </p>
              <p className="text-[#41403D] text-sm leading-relaxed font-semibold">
                Whatever your answer, we just want to help you take the next step. 
                With visa support, or by hearing how we can do better.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleFoundJob}
                variant="secondary"
                fullWidth
              >
                Yes, I&apos;ve found a job
              </Button>
              <Button
                onClick={handleNotYet}
                variant="secondary"
                fullWidth
              >
                Not yet - I&apos;m still looking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InitialStep;
