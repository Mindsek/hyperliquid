import Image from 'next/image';
import React from 'react';

const ScrollingMenu = () => {
  const contentWidth = 300;
  const numberOfDuplicates = 10;

  const totalContentWidth = contentWidth * numberOfDuplicates;

  return (
    <div className="mx-auto w-full overflow-hidden p-2 mb-4">
      <div className="flex animate-scrollTxt whitespace-nowrap">
        {[...Array(numberOfDuplicates * 2)].map((_, i) => (
          <div key={i} className="inline-flex justify-center items-center mr-4" style={{ width: `${contentWidth}px` }}>
            <span className="text-4xl font-bold">PENTHOUSE</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scrollTxt {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalContentWidth}px);
          }
        }
        .animate-scrollTxt {
          animation: scrollTxt 10s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default ScrollingMenu;
