import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  BarChart3,
  Database,
  UserCog,
  LifeBuoy,
  Sparkles,
  Terminal,
  LogOut,
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'academic-profile'
  | 'prediction'
  | 'prediction-history'
  | 'profile'
  | 'settings'
  | 'students'
  | 'analytics'
  | 'dataset'
  | 'model'
  | 'users'
  | 'support';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenOfflineGuide: () => void;
  onLogout?: () => void;
  studentCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  onOpenOfflineGuide,
  onLogout,
  studentCount,
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        
        {/* Navigation Category */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            {currentRole === 'student' ? 'Student Portal' : 'Main Navigation'}
          </div>
          <nav className="space-y-1">
            
            {/* 1. Dashboard */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {/* Student-specific Navigation */}
            {currentRole === 'student' && (
              <>
                {/* 2. My Academic Profile */}
                <button
                  onClick={() => onSelectTab('academic-profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'academic-profile'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>My Academic Profile</span>
                </button>

                {/* 3. My Prediction */}
                <button
                  onClick={() => onSelectTab('prediction')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'prediction'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    <span>My Prediction</span>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </button>

                {/* 4. Prediction History */}
                <button
                  onClick={() => onSelectTab('prediction-history')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'prediction-history'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Prediction History</span>
                </button>

                {/* 5. Profile */}
                <button
                  onClick={() => onSelectTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <UserCog className="w-4 h-4 text-purple-400" />
                  <span>Profile</span>
                </button>

                {/* 6. Settings */}
                <button
                  onClick={() => onSelectTab('settings')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Settings</span>
                </button>
              </>
            )}

            {/* Staff-only Navigation (Admin, Teacher, Analyst) */}
            {currentRole !== 'student' && (
              <>
                {/* Students Roster */}
                <button
                  onClick={() => onSelectTab('students')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'students'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Student Roster</span>
                  </div>
                  <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                    {studentCount}
                  </span>
                </button>

                {/* AI Predictions */}
                <button
                  onClick={() => onSelectTab('prediction')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'prediction'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BrainCircuit className="w-4 h-4 text-emerald-400" />
                    <span>AI Performance ML</span>
                  </div>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                </button>

                {/* Analytics */}
                <button
                  onClick={() => onSelectTab('analytics')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Cohort Analytics</span>
                </button>

                {/* Dataset Manager (Admin & Analyst) */}
                {(currentRole === 'admin' || currentRole === 'analyst') && (
                  <>
                    <button
                      onClick={() => onSelectTab('dataset')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'dataset'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      <span>Dataset Manager</span>
                    </button>

                    <button
                      onClick={() => onSelectTab('model')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === 'model'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <BrainCircuit className="w-4 h-4 text-purple-400" />
                      <span>AI Model &amp; Metrics</span>
                    </button>
                  </>
                )}
              </>
            )}

          </nav>
        </div>

        {/* Administration / System Category */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            System &amp; Support
          </div>
          <nav className="space-y-1">
            
            {/* User Management (Admin Only) */}
            {currentRole === 'admin' && (
              <button
                onClick={() => onSelectTab('users')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <UserCog className="w-4 h-4" />
                <span>User Management</span>
              </button>
            )}

            {/* Support Portal */}
            <button
              onClick={() => onSelectTab('support')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === 'support'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Help &amp; Documentation</span>
            </button>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

          </nav>
        </div>

      </div>

      {/* Bottom Offline Python Run Card */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Flask Backend</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Run 100% offline with SQLite &amp; scikit-learn on local machine.
          </p>
          <button
            onClick={onOpenOfflineGuide}
            className="w-full py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3 h-3" />
            <span>Run Flask Offline</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
