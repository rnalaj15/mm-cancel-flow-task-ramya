import React from 'react';
import Image from 'next/image';

interface ModalLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  showImage?: boolean;
  imageHeight?: string; // kept for backward compat but not used when header is present
  imageMarginTop?: string; // kept for backward compat
  mobileImageHeight?: string;
  isOpen: boolean;
}

const ModalLayout: React.FC<ModalLayoutProps> = ({
  children,
  header,
  showImage = true,
  imageHeight = 'auto',
  imageMarginTop = '25px',
  mobileImageHeight = '48',
  isOpen
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-[#BAB8B4] bg-opacity-50 flex items-end justify-center z-50 lg:items-center lg:p-0.5">
      <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-xl w-full max-w-7xl lg:w-[1300px] mt-6 lg:mt-0 flex flex-col" style={{ height: 'auto' }}>
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col h-full">
          {/* Header across full width */}
          {header}

          <div className="flex flex-1">
            {/* Content */}
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            
            {/* Right Image */}
            {showImage && (
              <div 
                className="w-[400px] relative overflow-hidden rounded-2xl m-5 self-stretch"
                style={header ? undefined : { height: imageHeight, marginTop: imageMarginTop }}
              >
                <Image
                  src="/empire-state-compressed.jpg"
                  alt="New York City skyline with Empire State Building"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col">
          {/* Header across full width */}
          {header}

          {/* Mobile Image on top */}
          {showImage && (
            <div className={`h-${mobileImageHeight} relative overflow-hidden rounded-2xl mt-2 mx-5`}>
              <Image
                src="/empire-state-compressed.jpg"
                alt="New York City skyline with Empire State Building"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          {/* Mobile Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
