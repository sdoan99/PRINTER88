import React, { useState } from 'react';

interface MarketProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

interface NavItem {
  id: string;
  image: string;
}

const navItems: NavItem[] = [
  { id: 'chart', image: 'https://i.postimg.cc/25ZrZQ7h/1.png' },
  { id: 'trade', image: 'https://i.postimg.cc/W4RxxQ0q/2-FS.png' },
  { id: 'screen', image: 'https://i.postimg.cc/TPrBxCc7/3-HT.png' },
  { id: 'analyze', image: 'https://i.postimg.cc/26rMShcz/4-SM.png' },
  { id: 'learn', image: 'https://i.postimg.cc/j5c9w2my/5-SC.png' },
];

const tabImages = {
  chart: 'https://i.postimg.cc/Dwkv6bJh/printer-1.png?auto=format&fit=crop&q=80&w=2940',
  trade: 'https://i.postimg.cc/XNBXgWHw/printer-2.png?auto=format&fit=crop&q=80&w=2940',
  screen: 'https://i.postimg.cc/QChG2pDG/Screenshot-2024-11-25-171519.png?auto=format&fit=crop&q=80&w=2940',
  analyze: 'https://i.postimg.cc/fRJnQzGL/Screenshot-2024-11-25-171756.png?auto=format&fit=crop&q=80&w=2940',
  learn: 'https://i.postimg.cc/8cdSnZrV/printer-5.png?auto=format&fit=crop&q=80&w=2940',
};

export function Market({ 
  title = "Where the world does markets",
  subtitle = "Join 90 million traders and investors taking the future into their own hands.",
  className = ""
}: MarketProps) {
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className={`bg-black text-white ${className}`}>
      <div className="container mx-auto px-4 pt-20 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          {title.includes("does") ? (
            <>
              Where the world does markets
            </>
          ) : title}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          {subtitle}
        </p>

        {/* Navigation */}
        <div className="flex justify-center items-center mb-8 max-w-6xl mx-auto px-4">
          <div className="inline-flex gap-4 md:gap-6 lg:gap-8 flex-nowrap overflow-x-auto max-w-full pb-4">
            {navItems.map(({ id, image }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative transition-all duration-300 transform hover:scale-105
                  ${activeTab === id ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
              >
                <img 
                  src={image} 
                  alt={id}
                  className="w-24 md:w-32 lg:w-40 h-auto rounded-lg"
                />
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full transition-opacity duration-300
                  ${activeTab === id ? 'opacity-100' : 'opacity-0'}`} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Gallery View */}
        <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-[#1C1C1C] max-w-6xl mx-auto">
          <div className="aspect-[16/9] relative">
            <img
              src={tabImages[activeTab as keyof typeof tabImages]}
              alt={`${activeTab} Interface`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}