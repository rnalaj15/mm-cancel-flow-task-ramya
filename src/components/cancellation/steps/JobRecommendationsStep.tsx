import React from 'react';
import Image from 'next/image';

interface JobRecommendationsStepProps {
  onClose: () => void;
}

const JobRecommendationsStep: React.FC<JobRecommendationsStepProps> = ({ onClose }) => {
  return (
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
  );
};

export default JobRecommendationsStep;
