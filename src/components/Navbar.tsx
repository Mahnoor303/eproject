import React from 'react';
import { User } from '../types';
import { 
  GraduationCap, 
  ShieldCheck, 
  Terminal, 
  Users, 
  BookOpen, 
  BarChart3, 
  Bell,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onOpenOfflineGuide: () => void;
  atRiskCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  onOpenOfflineGuide,
  atRiskCount,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Administrator</span>
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Teacher</span>
          </span>
        );
      case 'analyst':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
            <BarChart3 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Data Analyst</span>
          </span>
        );
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80">
            <Users className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Student</span>
          </span>
        );
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs transition-colors">
      {/* Brand */}
      <div 
        className="flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">EduPredict</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
              AI ML Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Student Performance &amp; Risk Analytics
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Active Role Indicator */}
        {getRoleBadge()}

        {/* Global Dark Mode Theme Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          id="theme-toggle-navbar"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-slate-600 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 shadow-xs'
          }`}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="hidden md:inline font-medium text-slate-200">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline font-medium text-slate-700">Dark</span>
            </>
          )}
        </button>

        {/* Python Flask Run Guide Button */}
        <button
          onClick={onOpenOfflineGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors"
          title="View Python Flask local execution instructions"
        >
          <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden lg:inline">Local Python Flask</span>
        </button>

        {/* Risk Alerts Indicator (For Admin, Teacher, Analyst) */}
        {currentUser.role !== 'student' && atRiskCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg text-xs font-semibold">
            <Bell className="w-3.5 h-3.5 text-red-500 dark:text-red-400 animate-pulse" />
            <span>{atRiskCount} At Risk</span>
          </div>
        )}

        {/* User Info Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-700">
            {currentUser.name.charAt(0)}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.email}</div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 rounded-lg transition-colors ml-1"
          title="Sign out of your account"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </header>
  );
};
