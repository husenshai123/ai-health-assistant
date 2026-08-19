import React from 'react';

// NAYA PROP: onOpenBMI add kiya
const Navbar = ({ userName, onExport, onClear, onLogout, onOpenProfile, onOpenAnalytics, onOpenBMI }) => {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 bg-slate-800 border-b border-slate-700 shadow-sm z-10 shrink-0">
      {/* ... (Logo wala part same rahega) ... */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 text-blue-400 text-xl sm:text-2xl shadow-inner border border-blue-500/20">🩺</div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-100 tracking-wide">AI Health Assistant</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs sm:text-sm text-emerald-400 font-medium">System Online</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex flex-col items-end mr-2 pr-4 border-r border-slate-700">
          <span className="text-sm font-bold text-slate-200 capitalize">{userName}</span>
          <span className="text-[10px] text-slate-400">Authenticated User</span>
        </div>

        {/* NAYA BUTTON: BMI Calculator */}
        <button onClick={onOpenBMI} className="hidden lg:flex items-center gap-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-400 text-sm font-medium py-2 px-4 rounded-xl transition-colors border border-pink-500/20 shadow-sm" title="Calculate BMI">
          ⚖️ BMI
        </button>

        <button onClick={onOpenProfile} className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors shadow-sm" title="Edit Patient Profile">
          👤 Profile
        </button>

        <button onClick={onOpenAnalytics} className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium py-2 px-4 rounded-xl transition-colors shadow-sm" title="View Health Analytics">
          📊 Analytics
        </button>

        <button onClick={onExport} className="hidden xl:flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-2 px-4 rounded-xl transition-colors border border-slate-600 shadow-sm">
          📄 Export
        </button>
        <button onClick={onClear} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:py-2 sm:px-4 gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-xl transition-colors border border-slate-600 shadow-sm">
          <span className="hidden sm:inline">Clear</span>
        </button>
        <button onClick={onLogout} className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:py-2 sm:px-4 gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl transition-colors border border-red-500/20 shadow-sm">
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;