
import React from 'react';
import { AILogo } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <AILogo className="w-8 h-8 text-brand-secondary" />
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI-Powered Permission Manager
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;