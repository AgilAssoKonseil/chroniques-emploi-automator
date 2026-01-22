
import React from 'react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-100">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tighter uppercase">Chroniques Emploi</h1>
              <p className="text-[9px] text-indigo-600 font-black tracking-[0.2em] uppercase">Automator • IA Radio</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              Moteur Gemini 3 Pro
            </span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>
      </div>
    </header>
  );
};
