'use client';

import { useState } from 'react';
import Image from 'next/image';

type FlowStep = 'initial' | 'downsell' | 'downsell_completed' | 'job_recommendations' | 'survey' | 'reason_selection' | 'congrats' | 'feedback' | 'visa' | 'completed';

interface CancellationFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CancellationFlow({ isOpen, onClose }: CancellationFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('initial');
  const [foundJobWithMigrateMate, setFoundJobWithMigrateMate] = useState<boolean | null>(null);
  const [rolesApplied, setRolesApplied] = useState<number | null>(null);
  const [companiesEmailed, setCompaniesEmailed] = useState<number | null>(null);
  const [companiesInterviewed, setCompaniesInterviewed] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [hasImmigrationLawyer, setHasImmigrationLawyer] = useState<boolean | null>(null);
  const [visaType, setVisaType] = useState('');

  // Survey questions state
  const [rolesAppliedSurvey, setRolesAppliedSurvey] = useState<string | null>(null);
  const [companiesEmailedSurvey, setCompaniesEmailedSurvey] = useState<string | null>(null);
  const [companiesInterviewedSurvey, setCompaniesInterviewedSurvey] = useState<string | null>(null);

  // A/B Testing and Downsell
  const [downsellVariant, setDownsellVariant] = useState<'A' | 'B' | null>(null);
  const [acceptedDownsell, setAcceptedDownsell] = useState<boolean | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string | null>(null);
  const [reasonFollowUpText, setReasonFollowUpText] = useState<string>('');

  // Mock user data - using first user from seed.sql
  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'user1@example.com'
  };

  // Mock subscription data - $25 plan from seed.sql
  const mockSubscription = {
    id: 'sub-123',
    user_id: mockUser.id,
    monthly_price: 2500, // $25.00 in cents
    status: 'active'
  };

  if (!isOpen) return null;

  // Deterministic A/B testing logic
  const getDownsellVariant = () => {
    if (downsellVariant) return downsellVariant; // Reuse existing variant

    // Generate deterministic variant based on user ID (secure)
    const hash = mockUser.id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a; // Convert to 32-bit integer
    }, 0);

    const variant = Math.abs(hash) % 2 === 0 ? 'A' : 'B';

    // TEMPORARY: Force Variant B for testing downsell screen
    const testVariant = 'B';

    console.log('🎯 A/B Testing Debug:', {
      userId: mockUser.id,
      hash: hash,
      hashMod2: Math.abs(hash) % 2,
      calculatedVariant: variant,
      actualVariant: testVariant
    });
    setDownsellVariant(testVariant);
    return testVariant;
  };

  // Calculate downsell price
  const getDownsellPrice = () => {
    const originalPrice = mockSubscription.monthly_price / 100; // Convert cents to dollars
    if (originalPrice === 25) return 15; // $25 → $15
    if (originalPrice === 29) return 19; // $29 → $19
    return originalPrice * 0.6; // 40% off fallback
  };

  const isReasonFollowUpComplete = () => {
    if (!cancellationReason) return false;

    if (cancellationReason === 'Too expensive') {
      return reasonFollowUpText.trim().length > 0; // Any amount entered
    } else {
      return reasonFollowUpText.trim().length >= 25; // Minimum 25 characters for textareas
    }
  };

  const handleBack = () => {
    if (currentStep === 'congrats') {
      setCurrentStep('initial');
    } else if (currentStep === 'downsell') {
      setCurrentStep('initial');
    } else if (currentStep === 'feedback') {
      // If coming from downsell, go back to downsell; if from congrats, go to congrats
      if (downsellVariant === 'B' && foundJobWithMigrateMate === false) {
        setCurrentStep('downsell');
      } else if (foundJobWithMigrateMate === true) {
        setCurrentStep('congrats');
      } else {
        setCurrentStep('initial');
      }
    } else if (currentStep === 'visa') {
      setCurrentStep('feedback');
    }
  };

  const handleFoundJob = () => {
    setCurrentStep('congrats');
  };

  const handleCongratsContinue = () => {
    // Only proceed if all required fields are filled
    if (foundJobWithMigrateMate !== null &&
        rolesApplied !== null &&
        companiesEmailed !== null &&
        companiesInterviewed !== null) {
      setCurrentStep('feedback');
    }
  };

  const handleFeedbackContinue = () => {
    if ((foundJobWithMigrateMate === true || foundJobWithMigrateMate === false) &&
        feedback.length >= 25) {
      setCurrentStep('visa');
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 'initial':
        return { step: 0, total: 3 }; // No steps shown
      case 'congrats':
        return { step: 1, total: 3 };
      case 'feedback':
        return { step: 2, total: 3 };
      case 'visa':
        return { step: 3, total: 3 };
      case 'downsell':
        return { step: 1, total: 3 };
      case 'survey':
        return { step: 2, total: 3 };
      case 'reason_selection':
        return { step: 3, total: 3 };
      case 'completed':
        return { step: 0, total: 3 }; // Show completed status only
      case 'downsell_completed':
        return { step: 0, total: 0 }; // No progress indicator
      case 'job_recommendations':
        return { step: 0, total: 0 }; // No progress indicator
      default:
        return { step: 0, total: 3 };
    }
  };

  const stepInfo = getStepInfo();

  return (
      <div className="fixed inset-0 bg-[#BAB8B4] bg-opacity-50 flex items-end justify-center z-50 lg:items-center lg:p-0.5">
        <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-xl w-full max-w-7xl lg:w-[1300px] mt-6 lg:mt-0 flex flex-col" style={{ height: 'auto' }}>
          {currentStep === 'initial' && (
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
                        <button
                            onClick={handleFoundJob}
                            className="w-full py-3 px-6 bg-white border border-gray-300 text-[#41403D] rounded-lg hover:bg-gray-50 transition-colors font-bold"
                        >
                          Yes, I&apos;ve found a job
                        </button>
                        <button
                            onClick={() => {
                              setFoundJobWithMigrateMate(false);
                              const variant = getDownsellVariant();
                              if (variant === 'B') {
                                setCurrentStep('downsell'); // Show downsell for variant B
                              } else {
                                onClose(); // Variant A - redirect to profile page
                              }
                            }}
                            className="w-full py-3 px-6 bg-white border border-gray-300 text-[#41403D] rounded-lg hover:bg-gray-50 transition-colors font-bold"
                        >
                          Not yet - I&apos;m still looking
                        </button>
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
                        <p className="text-lg text-[#41403D] italic font-medium mb-3">Have you found a job yet?</p>
                        <p className="text-[#41403D] text-sm leading-relaxed font-semibold">
                          Whatever your answer, we just want to help you take the next step.
                          With visa support, or by hearing how we can do better.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <button
                            onClick={handleFoundJob}
                            className="w-full py-3 px-4 bg-white border border-gray-300 text-[#41403D] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Yes, I&apos;ve found a job
                        </button>
                        <button
                            onClick={() => {
                              setFoundJobWithMigrateMate(false);
                              const variant = getDownsellVariant();
                              if (variant === 'B') {
                                setCurrentStep('downsell'); // Show downsell for variant B
                              } else {
                                onClose(); // Variant A - redirect to profile page
                              }
                            }}
                            className="w-full py-3 px-4 bg-white border border-gray-300 text-[#41403D] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Not yet - I&apos;m still looking
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          )}

          {currentStep === 'completed' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                      onClick={() => setCurrentStep('reason_selection')}
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
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                          <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                        </div>
                        <span className="text-sm text-gray-600">Completed</span>
                      </div>
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
                      <div>
                        {/* Check if this is from the "Not yet" flow by checking if cancellationReason exists */}
                        {cancellationReason ? (
                            // "Not yet" flow completion
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
                        ) : foundJobWithMigrateMate === true ? (
                            // "Yes" flow - found job WITH MigrateMate
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
                        ) : (
                            // "Yes" flow - found job but NOT with MigrateMate
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
                        )}
                      </div>
                      <div className="border-t border-gray-200"></div>


                      <button
                          onClick={onClose}
                          className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        {cancellationReason ? 'Back to Jobs' : 'Finish'}
                      </button>
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
                        {/* Check if this is from the "Not yet" flow by checking if cancellationReason exists */}
                        {cancellationReason ? (
                            // "Not yet" flow completion
                            <>
                              <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-3">
                                Sorry to see you go, mate.
                              </h3>
                              <p className="text-lg font-semibold text-[#41403D] leading-normal mb-6">
                                Thanks for being with us, and you&apos;re<br />
                                always welcome back.
                              </p>
                              <div className="space-y-1 mb-6">
                                <p className="text-sm text-[#41403D]">
                                  Your subscription is set to end on XX date.
                                </p>
                                <p className="text-sm text-[#41403D]">
                                  You&apos;ll still have full access until then. No further charges after that.
                                </p>
                              </div>
                              <p className="text-sm text-[#41403D] mb-6">
                                Changed your mind? You can reactivate anytime before your end date.
                              </p>
                            </>
                        ) : foundJobWithMigrateMate === true ? (
                            // "Yes" flow - found job WITH MigrateMate
                            <>
                              <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-4">
                                All done, your cancellation&apos;s been processed.
                              </h3>
                              <p className="text-[#41403D] text-sm leading-relaxed">
                                We&apos;re stoked to hear you&apos;ve landed a job and sorted your visa.
                                Big congrats from the team. 🙌
                              </p>
                            </>
                        ) : (
                            // "Yes" flow - found job but NOT with MigrateMate
                            <>
                              <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-1">
                                Your cancellation&apos;s all sorted, mate,
                              </h3>
                              <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-6">
                                no more charges.
                              </h3>

                              {/* Profile Section */}
                              <div className="mb-6">
                                <div className="flex items-center mb-4 bg-gray-100 rounded-lg p-2">
                                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-100">
                                    <Image
                                        src="/mihailo-profile.jpeg"
                                        alt="Mihailo Bozic"
                                        fill
                                        className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#41403D] text-sm">Mihailo Bozic</div>
                                    <div className="text-[#41403D] text-xs">&lt;mihailo@migratemate.co&gt;</div>
                                  </div>
                                </div>
                                <div className="space-y-3 pl-4">
                                  <p className="text-[#41403D] text-sm">
                                    I&apos;ll be reaching out soon to help with the visa side of things.
                                  </p>
                                  <p className="text-[#41403D] text-sm">
                                    We&apos;ve got your back, whether it&apos;s questions, paperwork, or just
                                    figuring out your options.
                                  </p>
                                  <p className="text-[#41403D] text-sm">
                                    Keep an eye on your inbox, I&apos;ll be in touch <u>shortly</u>.
                                  </p>
                                </div>
                              </div>
                            </>
                        )}
                      </div>

                      <button
                          onClick={onClose}
                          className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        {cancellationReason ? 'Back to Jobs' : 'Finish'}
                      </button>
                    </div>
                  </div>
                </div>
              </>
          )}

          {currentStep === 'downsell_completed' && (
              <>
                {/* Simple Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-black flex-1 text-center">Subscription</h2>
                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                  >
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
                            Starting from XX date, your monthly payment will be ${acceptedDownsell ? getDownsellPrice() : (mockSubscription.monthly_price / 100)}.
                          </p>
                          <p className="text-[#62605C] text-sm italic">
                            You can cancel anytime before then.
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200"></div>

                      <button
                          onClick={() => {
                            setCurrentStep('job_recommendations');
                          }}
                          className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Land your dream role
                      </button>
                    </div>
                  </div>

                  {/* Right Image - Aligned with content from "mate" to button */}
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

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  {/* Image on top */}
                  <div className="h-48 relative overflow-hidden rounded-2xl mt-2 mx-5">
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
                            Starting from XX date, your monthly payment will be ${acceptedDownsell ? getDownsellPrice() : (mockSubscription.monthly_price / 100)}.
                          </p>
                          <p className="text-[#41403D] text-xs italic">
                            You can cancel anytime before then.
                          </p>
                        </div>
                      </div>

                      <button
                          onClick={() => {
                            setCurrentStep('job_recommendations');
                          }}
                          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Land your dream role
                      </button>
                    </div>
                  </div>
                </div>
              </>
          )}

          {currentStep === 'job_recommendations' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-black flex-1 text-center">Subscription</h2>
                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block overflow-hidden h-full">
                  <div className="flex gap-4 h-full p-6">
                    {/* Left Content - Properly constrained */}
                    <div className="flex-1 min-w-0 overflow-y-auto">
                      <div className="space-y-4 pr-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-3">
                            Awesome — we&apos;ve pulled together a few roles that seem like a great fit for you.
                          </h3>
                          <p className="text-[#41403D] mb-4">
                            Take a look and see what sparks your interest.
                          </p>
                        </div>

                        {/* Job Card - Compact but complete */}
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 w-full">
                          <div className="flex items-start justify-between mb-3 gap-3">
                            <div className="flex items-center min-w-0 flex-1">
                              <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center mr-3 flex-shrink-0">
                                <span className="text-white font-bold text-sm">AC</span>
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-[#41403D]">Automation Controls Engineer</h4>
                                <p className="text-sm text-gray-600">Randstad USA • Memphis, Tennessee</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="flex flex-wrap gap-1 text-xs justify-end">
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Full Time</span>
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Associate</span>
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">Bachelor&apos;s</span>
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">On-Site</span>
                              </div>
                            </div>
                          </div>

                          {/* Combined section with visa cards and salary aligned */}
                          <div className="mb-3">
                            <div className="text-right text-sm text-gray-600 mb-2">
                              Visas sponsored by company in the last year
                            </div>
                            <div className="flex items-center justify-between">
                              {/* Left side - Salary */}
                              <div className="flex items-center">
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">NEW JOB</span>
                                <span className="text-sm font-semibold text-[#41403D]">$150,000/yr - $170,000/yr</span>
                              </div>

                              {/* Right side - Visa cards */}
                              <div className="flex items-start space-x-2">
                                <div className="relative">
                                  <div className="absolute -top-1 -right-1 bg-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                    205
                                  </div>
                                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded border text-xs">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                    <span className="text-gray-600">Green Card</span>
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="absolute -top-1 -right-1 bg-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                    1
                                  </div>
                                  <div className="bg-gray-50 px-2 py-1 rounded border text-xs">
                                    <div className="text-blue-600 font-medium text-center">AU E-3</div>
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="absolute -top-1 -right-1 bg-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                    +
                                  </div>
                                  <div className="bg-gray-50 px-2 py-1 rounded border text-xs">
                                    <div className="text-blue-600 font-medium text-center">CA/MX TN</div>
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="absolute -top-1 -right-1 bg-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                    +
                                  </div>
                                  <div className="flex items-center bg-gray-50 px-2 py-1 rounded border text-xs">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                                    <span className="text-gray-600">OPT</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200"></div>

                          <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                            The Electrical Automation Controls Engineer will design, implement, and maintain industrial automation systems, specializing in
                            PLC programming using Siemens TIA Portal. The ideal candidate will have a bachelor&apos;s degree in Electrical Engineering and at
                            least 4 years of industrial automation experience. This role offers autonomy and is ideal for someone seeking growth in a
                            supportive company. Key benefits include comprehensive healthcare and retirement plans.
                          </p>

                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="text-sm text-gray-500 min-w-0">
                              Company visa contact: <span className="text-blue-600">barbara.tuck@randstadusa.com</span>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                              <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-gray-50 text-sm">
                                Save Job
                              </button>
                              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Land your dream role
                        </button>
                      </div>
                    </div>

                    {/* Right Image - Fixed width */}
                    <div className="w-[400px] relative overflow-hidden rounded-2xl flex-shrink-0" style={{ height: '500px' }}>
                      <Image
                          src="/empire-state-compressed.jpg"
                          alt="New York City skyline with Empire State Building"
                          fill
                          className="object-cover"
                          priority
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden">
                  {/* Image on top */}
                  <div className="h-48 relative overflow-hidden rounded-2xl mt-2 mx-5">
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
                          Awesome — we&apos;ve pulled together a few roles that seem like a great fit for you.
                        </h3>
                        <p className="text-[#41403D] text-sm mb-4">
                          Take a look and see what sparks your interest.
                        </p>
                      </div>

                      {/* Mobile Job Card */}
                      <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start mb-2">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs">AC</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-[#41403D] text-sm">Automation Controls Engineer</h4>
                            <p className="text-xs text-gray-600">Randstad USA • Memphis, Tennessee</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">Full Time</span>
                              <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">Associate</span>
                              <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">Bachelor&apos;s</span>
                              <span className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded-full text-xs">On-Site</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Visa sponsorship section */}
                        <div className="mb-2 text-xs text-gray-600">
                          <div className="text-center mb-2">Visas sponsored by company in the last year</div>
                          <div className="flex justify-center items-start space-x-1">
                            <div className="relative">
                              <div className="absolute -top-0.5 -right-0.5 bg-white w-3 h-3 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                205
                              </div>
                              <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded border text-xs">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                                <span className="text-gray-600">Green Card</span>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute -top-0.5 -right-0.5 bg-white w-3 h-3 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                1
                              </div>
                              <div className="bg-gray-50 px-1.5 py-0.5 rounded border text-xs">
                                <div className="text-blue-600 font-medium text-center">AU E-3</div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute -top-0.5 -right-0.5 bg-white w-3 h-3 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                +
                              </div>
                              <div className="bg-gray-50 px-1.5 py-0.5 rounded border text-xs">
                                <div className="text-blue-600 font-medium text-center">CA/MX TN</div>
                              </div>
                            </div>
                            <div className="relative">
                              <div className="absolute -top-0.5 -right-0.5 bg-white w-3 h-3 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 border border-gray-200">
                                +
                              </div>
                              <div className="flex items-center bg-gray-50 px-1.5 py-0.5 rounded border text-xs">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                                <span className="text-gray-600">OPT</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <span className="bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded mr-1">NEW JOB</span>
                          <span className="text-xs font-semibold text-[#41403D]">$150,000/yr - $170,000/yr</span>
                        </div>

                        <p className="text-xs text-gray-700 mb-3">
                          The Electrical Automation Controls Engineer will design, implement, and maintain industrial automation systems,
                          specializing in PLC programming using Siemens TIA Portal. The ideal candidate will have a bachelor&apos;s degree in
                          Electrical Engineering and at least 4 years of industrial automation experience. This role offers autonomy and is
                          ideal for someone seeking growth in a supportive company. Key benefits include competitive salary and retirement plans.
                        </p>

                        <div className="mb-2 text-xs text-gray-500">
                          Company visa contact: <span className="text-blue-600">barbara.beck@randstadusa.com</span>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-xs">
                            Save Job
                          </button>
                          <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs">
                            Apply
                          </button>
                        </div>
                      </div>

                      <button
                          onClick={onClose}
                          className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Land your dream role
                      </button>
                    </div>
                  </div>
                </div>
              </>
          )}

          {/* Survey Screen */}
          {currentStep === 'survey' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                      onClick={() => setCurrentStep('downsell')}
                      className="flex items-center text-[#41403D] hover:text-[#41403D]"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <div className="flex-1 flex justify-center">
                    <h2 className="text-lg font-bold text-black">Subscription Cancellation</h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-4 h-2 bg-gray-300 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-600">Step 2 of 3</span>
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
                  <div className="flex-1 p-6 pr-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#41403D] leading-tight mb-4">
                          Help us understand how you were using Migrate Mate.
                        </h3>
                      </div>

                      {/* Question 1: Roles Applied */}
                      <div className="mb-4">
                        <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many roles did you <u>apply</u> for through Migrate Mate?</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setRolesAppliedSurvey(option)}
                                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      rolesAppliedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
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
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1-5', '6-20', '20+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setCompaniesEmailedSurvey(option)}
                                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      companiesEmailedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
                                  }`}
                              >
                                {option}
                              </button>
                          ))}
                        </div>
                      </div>

                      {/* Question 3: Companies Interviewed */}
                      <div className="mb-5">
                        <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many different companies did you <u>interview</u> with?</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1-2', '3-5', '5+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setCompaniesInterviewedSurvey(option)}
                                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      companiesInterviewedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
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
                            onClick={() => {
                              setAcceptedDownsell(true);
                              setCurrentStep('downsell_completed');
                            }}
                            className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          Get 50% off | $12.50 <span className="text-green-200 line-through">$25</span>
                        </button>
                        <button
                            onClick={() => {
                              if (rolesAppliedSurvey && companiesEmailedSurvey && companiesInterviewedSurvey) {
                                setCurrentStep('reason_selection');
                              }
                            }}
                            disabled={!rolesAppliedSurvey || !companiesEmailedSurvey || !companiesInterviewedSurvey}
                            className={`w-full py-3 px-6 rounded-lg transition-colors font-medium ${
                                rolesAppliedSurvey && companiesEmailedSurvey && companiesInterviewedSurvey
                                    ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                                    : 'bg-gray-200 text-[#41403D] cursor-not-allowed opacity-60'
                            }`}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="w-[350px] relative overflow-hidden rounded-2xl mr-5 self-start" style={{ height: '400px', marginTop: '15px' }}>
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
                  <div className="h-48 relative overflow-hidden rounded-2xl mt-2 mx-5">
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
                        <h3 className="text-xl font-bold text-[#41403D] leading-tight mb-4">
                          Help us understand how you were using Migrate Mate.
                        </h3>
                      </div>

                      {/* Question 1: Roles Applied */}
                      <div className="mb-4">
                        <h4 className="text-[#41403D] font-medium mb-3 text-sm">How many roles did you <u>apply</u> for through Migrate Mate?</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1 - 5', '6 - 20', '20+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setRolesAppliedSurvey(option)}
                                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      rolesAppliedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
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
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1-5', '6-20', '20+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setCompaniesEmailedSurvey(option)}
                                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      companiesEmailedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
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
                        <div className="grid grid-cols-4 gap-2">
                          {['0', '1-2', '3-5', '5+'].map((option) => (
                              <button
                                  key={option}
                                  onClick={() => setCompaniesInterviewedSurvey(option)}
                                  className={`py-2 px-2 rounded-lg border text-center font-medium transition-colors text-sm ${
                                      companiesInterviewedSurvey === option
                                          ? 'bg-purple-600 text-white border-purple-600'
                                          : 'bg-white text-[#41403D] border-gray-300 hover:border-purple-400'
                                  }`}
                              >
                                {option}
                              </button>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3 mb-6">
                        <button
                            onClick={() => {
                              setAcceptedDownsell(true);
                              setCurrentStep('downsell_completed');
                            }}
                            className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          Get 50% off | $12.50 <span className="text-green-200 line-through">$25</span>
                        </button>
                        <button
                            onClick={() => {
                              if (rolesAppliedSurvey && companiesEmailedSurvey && companiesInterviewedSurvey) {
                                setCurrentStep('reason_selection');
                              }
                            }}
                            disabled={!rolesAppliedSurvey || !companiesEmailedSurvey || !companiesInterviewedSurvey}
                            className={`w-full py-3 px-4 rounded-lg transition-colors font-medium ${
                                rolesAppliedSurvey && companiesEmailedSurvey && companiesInterviewedSurvey
                                    ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                                    : 'bg-gray-200 text-[#41403D] cursor-not-allowed opacity-60'
                            }`}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
          )}

          {currentStep === 'reason_selection' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                      onClick={() => setCurrentStep('survey')}
                      className="flex items-center text-[#41403D] hover:text-[#41403D]"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <div className="flex-1 flex justify-center">
                    <h2 className="text-lg font-bold text-black">Subscription Cancellation</h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                      <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                    </div>
                    <span className="text-sm text-gray-600">Step 3 of 3</span>
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
                                {cancellationReason === 'Too expensive' && (
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
                                )}

                                {cancellationReason === 'Platform not helpful' && (
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
                                )}

                                {cancellationReason === 'Not enough relevant jobs' && (
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
                                )}

                                {cancellationReason === 'Decided not to move' && (
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
                                )}

                                {cancellationReason === 'Other' && (
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
                                )}
                              </div>
                            </div>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <button
                            onClick={() => {
                              setAcceptedDownsell(true);
                              onClose(); // Complete the cancellation flow
                            }}
                            className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                        >
                          Get 50% off | $12.50 <span className="text-green-200 line-through">$25</span>
                        </button>
                        <button
                            onClick={() => {
                              if (isReasonFollowUpComplete()) {
                                setCurrentStep('completed');
                              }
                            }}
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

                  {/* Right Image */}
                  <div className="w-[400px] relative overflow-hidden rounded-2xl mb-8 mr-5 self-stretch" style={{ marginTop: '25px' }}>
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
                  <div className="h-48 relative overflow-hidden rounded-2xl mt-2 mx-5">
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
                          What&apos;s the main reason for cancelling?
                        </h3>
                        <p className="text-[#41403D] text-sm mb-3">
                          Please take a minute to let us know why:
                        </p>
                        {!cancellationReason && (
                            <p className="text-red-500 text-sm mb-4">
                              To help us understand your experience, please select a reason for cancelling*
                            </p>
                        )}
                      </div>

                      {/* Radio Button Options */}
                      <div className="space-y-3 mb-6">
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
                                  <span className="ml-3 text-[#41403D] font-medium text-sm">{reason}</span>
                                </label>
                            ))
                        ) : (
                            // Show only selected option and follow-up
                            <div className="space-y-3">
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
                                <span className="ml-3 text-[#41403D] font-medium text-sm">{cancellationReason}</span>
                              </label>

                              {/* Follow-up question based on selection */}
                              <div className="mt-3">
                                {cancellationReason === 'Too expensive' && (
                                    <>
                                      <p className="text-[#41403D] font-medium mb-2 text-sm">
                                        What would be the maximum you would be willing to pay?*
                                      </p>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#41403D]">$</span>
                                        <input
                                            type="text"
                                            placeholder=""
                                            value={reasonFollowUpText}
                                            onChange={(e) => setReasonFollowUpText(e.target.value)}
                                            className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                                        />
                                      </div>
                                    </>
                                )}

                                {cancellationReason === 'Platform not helpful' && (
                                    <>
                                      <p className="text-[#41403D] font-medium mb-2 text-sm">
                                        What can we change to make the platform more helpful?*
                                      </p>
                                      <p className="text-red-500 text-xs mb-2">
                                        Please enter at least 25 characters so we can understand your feedback*
                                      </p>
                                      <textarea
                                          placeholder=""
                                          rows={3}
                                          value={reasonFollowUpText}
                                          onChange={(e) => setReasonFollowUpText(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-black"
                                      />
                                      <p className="text-xs text-gray-500 text-right mt-1">Min 25 characters ({reasonFollowUpText.length}/25)</p>
                                    </>
                                )}

                                {cancellationReason === 'Not enough relevant jobs' && (
                                    <>
                                      <p className="text-[#41403D] font-medium mb-2 text-sm">
                                        In which way can we make the jobs more relevant?*
                                      </p>
                                      <textarea
                                          placeholder=""
                                          rows={3}
                                          value={reasonFollowUpText}
                                          onChange={(e) => setReasonFollowUpText(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-black"
                                      />
                                      <p className="text-xs text-gray-500 text-right mt-1">Min 25 characters ({reasonFollowUpText.length}/25)</p>
                                    </>
                                )}

                                {cancellationReason === 'Decided not to move' && (
                                    <>
                                      <p className="text-[#41403D] font-medium mb-2 text-sm">
                                        What changed for you to decide to not move?*
                                      </p>
                                      <textarea
                                          placeholder=""
                                          rows={3}
                                          value={reasonFollowUpText}
                                          onChange={(e) => setReasonFollowUpText(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-black"
                                      />
                                      <p className="text-xs text-gray-500 text-right mt-1">Min 25 characters ({reasonFollowUpText.length}/25)</p>
                                    </>
                                )}

                                {cancellationReason === 'Other' && (
                                    <>
                                      <p className="text-[#41403D] font-medium mb-2 text-sm">
                                        What would have helped you the most?*
                                      </p>
                                      <textarea
                                          placeholder=""
                                          rows={3}
                                          value={reasonFollowUpText}
                                          onChange={(e) => setReasonFollowUpText(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-black"
                                      />
                                      <p className="text-xs text-gray-500 text-right mt-1">Min 25 characters ({reasonFollowUpText.length}/25)</p>
                                    </>
                                )}
                              </div>
                            </div>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="space-y-3">
                        <button
                            onClick={() => {
                              setAcceptedDownsell(true);
                              onClose(); // Complete the cancellation flow
                            }}
                            className="w-full py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
                        >
                          Get 50% off | $12.50 <span className="text-green-200 line-through">$25</span>
                        </button>
                        <button
                            onClick={() => {
                              if (isReasonFollowUpComplete()) {
                                setCurrentStep('completed');
                              }
                            }}
                            disabled={!isReasonFollowUpComplete()}
                            className={`w-full py-3 px-4 rounded-lg transition-colors font-medium text-sm ${
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
                </div>
              </>
          )}

          {/* Other screens (congrats, feedback) */}
          {currentStep !== 'initial' && currentStep !== 'completed' && currentStep !== 'downsell_completed' && currentStep !== 'job_recommendations' && currentStep !== 'survey' && currentStep !== 'reason_selection' && (
              <>
                {/* Header with back button and progress */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <button
                      onClick={handleBack}
                      className="flex items-center text-[#41403D] hover:text-[#41403D]"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <div className="flex items-center">
                    <h2 className="text-lg font-semibold text-black">Subscription Cancellation</h2>
                    <div className="flex items-center ml-3 space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(stepInfo.total)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-4 h-2 rounded-sm ${
                                    i < stepInfo.step ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                      </div>
                      <span className="text-sm text-[#41403D]">Step {stepInfo.step} of {stepInfo.total}</span>
                    </div>
                  </div>

                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content for other screens */}
                <div className="flex flex-col lg:flex-row">
                  {/* Left Content */}
                  <div className="flex-1 p-8">
                    {currentStep === 'congrats' && (
                        <div className="flex flex-col h-full justify-between">
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-2xl font-bold text-[#41403D] mb-4">
                                Congrats on the new role! 🎉
                              </h3>
                              <div className="mb-6">
                                <p className="text-[#41403D] mb-4">Did you find this job with MigrateMate?*</p>
                                <div className="flex space-x-3">
                                  <button
                                      onClick={() => setFoundJobWithMigrateMate(true)}
                                      className={`w-full px-6 py-2 rounded-lg border transition-colors ${
                                          foundJobWithMigrateMate === true
                                              ? 'bg-blue-600 text-white border-blue-600'
                                              : 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400'
                                      }`}
                                  >
                                    Yes
                                  </button>
                                  <button
                                      onClick={() => setFoundJobWithMigrateMate(false)}
                                      className={`w-full px-6 py-2 rounded-lg border transition-colors ${
                                          foundJobWithMigrateMate === false
                                              ? 'bg-blue-600 text-white border-blue-600'
                                              : 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400'
                                      }`}
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Survey Questions */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[#41403D] mb-2">
                                  How many roles did you <u>apply</u> for through MigrateMate?*
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                  {["0", "1-5", "6-20", "20+"].map((option, index) => (
                                      <button
                                          key={option}
                                          onClick={() => setRolesApplied(index)}
                                          className={`px-4 py-2 rounded-lg border transition-colors h-10 ${
                                              rolesApplied === index
                                                  ? 'bg-blue-600 text-white border-blue-600'
                                                  : 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400'
                                          }`}
                                      >
                                        {option}
                                      </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[#41403D] mb-2">
                                  How many companies did you <u>email</u> directly?*
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                  {["0", "1-5", "6-20", "20+"].map((option, index) => (
                                      <button
                                          key={option}
                                          onClick={() => setCompaniesEmailed(index)}
                                          className={`px-4 py-2 rounded-lg border transition-colors h-10 ${
                                              companiesEmailed === index
                                                  ? 'bg-blue-600 text-white border-blue-600'
                                                  : 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400'
                                          }`}
                                      >
                                        {option}
                                      </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="block text-[#41403D] mb-2">
                                  How many different companies did you <u>interview</u> with?*
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                  {["0", "1-2", "3-5", "5+"].map((option, index) => (
                                      <button
                                          key={option}
                                          onClick={() => setCompaniesInterviewed(index)}
                                          className={`px-4 py-2 rounded-lg border transition-colors h-10 ${
                                              companiesInterviewed === index
                                                  ? 'bg-blue-600 text-white border-blue-600'
                                                  : 'bg-white text-[#41403D] border-gray-300 hover:border-gray-400'
                                          }`}
                                      >
                                        {option}
                                      </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6">
                            <button
                                onClick={handleCongratsContinue}
                                disabled={foundJobWithMigrateMate === null || rolesApplied === null || companiesEmailed === null || companiesInterviewed === null}
                                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
                            >
                              Continue
                            </button>
                          </div>
                        </div>
                    )}

                    {currentStep === 'feedback' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-[#41403D] mb-4">
                              What&apos;s one thing you wish we could&apos;ve helped you with?
                            </h3>
                            <p className="text-[#41403D] mb-6">
                              We&apos;re always looking to improve, your thoughts can help us make MigrateMate more useful for others.*
                            </p>
                          </div>

                          <div>
                      <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Your feedback..."
                          className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                      />
                            <div className="text-right text-sm text-[#41403D] mt-2">
                              Min 25 characters ({feedback.length}/25)
                            </div>
                          </div>

                          <button
                              onClick={handleFeedbackContinue}
                              disabled={feedback.length < 25}
                              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
                          >
                            Continue
                          </button>
                        </div>
                    )}

                    {currentStep === 'visa' && (
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
                              <p className="text-[#41403D] mb-2">Is your company providing an immigration lawyer to help with your visa?*</p>
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
                            <button
                                onClick={() => setCurrentStep('completed')}
                                disabled={hasImmigrationLawyer === null || !visaType.trim()}
                                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500"
                            >
                              Complete cancellation
                            </button>
                          </div>
                        </div>
                    )}

                    {currentStep === 'downsell' && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-[#41403D] mb-4">
                              We built this to help you land the job, this makes it a little easier.
                            </h3>
                            <p className="text-[#41403D] mb-6">
                              We&apos;ve been there and we&apos;re here to help you.
                            </p>
                          </div>

                          {/* Downsell Offer Box - Matching Screenshot */}
                          <div className="bg-purple-100 border-2 border-purple-200 rounded-xl p-6 mb-6">
                            <div className="text-center">
                              <h4 className="text-lg font-bold text-[#41403D] mb-4">
                                Here&apos;s <u className="text-[#41403D]">50% off</u> until you find a job.
                              </h4>
                              <div className="flex items-baseline justify-center space-x-3 mb-4">
                           <span className="text-3xl font-bold text-purple-600">
                             ${getDownsellPrice()}/month
                           </span>
                                <span className="text-lg text-gray-500 line-through">
                             ${mockSubscription.monthly_price / 100}/month
                           </span>
                              </div>
                              <button
                                  onClick={() => {
                                    setAcceptedDownsell(true);
                                    setCurrentStep('downsell_completed');
                                  }}
                                  className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold mb-3"
                              >
                                Get 50% off
                              </button>
                              <p className="text-sm text-[#41403D] italic">
                                You won&apos;t be charged until your next billing date.
                              </p>
                            </div>
                          </div>

                          {/* No Thanks Button */}
                          <button
                              onClick={() => {
                                setAcceptedDownsell(false);
                                setCurrentStep('survey');
                              }}
                              className="w-full py-3 px-6 bg-white border border-gray-300 text-[#41403D] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                          >
                            No thanks
                          </button>
                        </div>
                    )}
                  </div>

                  {/* Right Image for other screens */}
                  <div className="lg:w-[400px] h-auto relative m-5 overflow-hidden rounded-2xl">
                    <Image
                        src="/empire-state-compressed.jpg"
                        alt="New York City skyline with Empire State Building"
                        width={400}
                        height={600}
                        className="object-cover h-full"
                        priority
                    />
                  </div>
                </div>
              </>
          )}
        </div>
      </div>
  );
}

