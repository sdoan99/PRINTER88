import React from 'react';
import { TradingViewWidget } from './TradingViewHeroWidget';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <section className="relative w-full h-screen">
      <img
        src="https://i.postimg.cc/dsTWPkDp/Evergreen-Printer-Hero-Bg-1.png"
        alt="Strategic thinking background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 flex items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full md:w-1/3">
            <h1 className="text-white font-bold leading-tight mb-2">
              <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap">
                {title}
              </span>
              {subtitle && (
                <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl whitespace-nowrap">
                  {subtitle}
                </span>
              )}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 whitespace-nowrap">
              Game winning edge starts here
            </p>
            <div className="mt-[100px]">
              <TradingViewWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Bouncing Caret */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ChevronDown className="w-8 h-8 text-white animate-bounce-slow" />
      </div>
    </section>
  );
};

export default Hero;