import React from 'react';
import { Student, User, MLPredictionResult } from '../types';
import {
  Users,
  ShieldAlert,
  BrainCircuit,
  Award,
  UserCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

interface AdminDashboardProps {
  students: Student[];
  users: User[];
  predictions: MLPredictionResult[];
  onNavigate: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  users,
  predictions,
  onNavigate,
  onSelectStudent,
}) => {
  const totalStudents = students.length;
  const studentsWithData = students.filter(
    (s) => s.attendance !== null && s.previousMarks !== null
  );

  const atRiskStudents = studentsWithData.filter(
    (s) => s.attendance! < 65 || s.previousMarks! < 50
  );

  const avgAttendance = studentsWithData.length
    ? (studentsWithData.reduce((acc, s) => acc + (s.attendance ?? 0), 0) / studentsWithData.length).toFixed(1) + '%'
    : 'N/A';

  const avgMarks = studentsWithData.length
    ? (studentsWithData.reduce((acc, s) => acc + (s.previousMarks ?? 0), 0) / studentsWithData.length).toFixed(1) + '%'
    : 'N/A';

  const avgStudy = studentsWithData.length
    ? (studentsWithData.reduce((a, s) => a + (s.studyHours ?? 0), 0) / studentsWithData.length).toFixed(1)
    : 'N/A';

  const avgLms = studentsWithData.length
    ? (studentsWithData.reduce((a, s) => a + (s.lmsActivity ?? 0), 0) / studentsWithData.length).toFixed(0)
    : 'N/A';

  // Performance Class Breakdown (only calculated for students with actual academic data)
  const perfCounts = {
    Excellent: 0,
    Good: 0,
    Average: 0,
    'At Risk': 0,
  };

  studentsWithData.forEach((s) => {
    const att = s.attendance ?? 0;
    const marks = s.previousMarks ?? 0;
    const assign = s.assignmentScore ?? 0;
    const quiz = s.quizScore ?? 0;
    const study = s.studyHours ?? 0;
    const lms = s.lmsActivity ?? 0;
    const part = s.participation ?? 1;

    const score =
      att * 0.2 +
      marks * 0.25 +
      assign * 0.15 +
      quiz * 0.15 +
      (study / 30) * 10 +
      lms * 0.1 +
      (part / 10) * 5;

    if (att < 60 || score < 52) {
      perfCounts['At Risk']++;
    } else if (score >= 84) {
      perfCounts.Excellent++;
    } else if (score >= 70) {
      perfCounts.Good++;
    } else {
      perfCounts.Average++;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPredict Administration Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">System &amp; Cohort Overview</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            Real-time machine learning telemetry, proactive academic risk identification, and institution-wide student metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Run Prediction</span>
          </button>
          <button
            onClick={() => onNavigate('students')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all border border-white/20"
          >
            <span>View All Students</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registered Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalStudents}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{studentsWithData.length} with submitted data</span>
          </div>
        </div>

        {/* At-Risk Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At-Risk Students</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">{atRiskStudents.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-red-600">
              {studentsWithData.length ? Math.round((atRiskStudents.length / studentsWithData.length) * 100) : 0}%
            </span>{' '}
            of evaluated cohort
          </div>
        </div>

        {/* Avg Attendance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{avgAttendance}</div>
          <div className="text-xs text-slate-500 mt-1">
            {studentsWithData.length ? 'Benchmark: ≥ 75.0%' : 'No submitted attendance'}
          </div>
        </div>

        {/* Total ML Inferences */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ML Predictions</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{predictions.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-purple-600 font-semibold">RandomForest</span> v2.4 (94.2% Acc)
          </div>
        </div>

      </div>

      {/* Main Content Grid: Performance Tier Breakdown & At-Risk Callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Distribution */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Cohort Academic Classification</h2>
              <p className="text-xs text-slate-500">Multi-class breakdown for {studentsWithData.length} evaluated students</p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { label: 'Excellent', count: perfCounts.Excellent, color: 'bg-emerald-500', barBg: 'bg-emerald-100', text: 'text-emerald-700' },
              { label: 'Good', count: perfCounts.Good, color: 'bg-blue-500', barBg: 'bg-blue-100', text: 'text-blue-700' },
              { label: 'Average', count: perfCounts.Average, color: 'bg-amber-500', barBg: 'bg-amber-100', text: 'text-amber-700' },
              { label: 'At Risk', count: perfCounts['At Risk'], color: 'bg-red-500', barBg: 'bg-red-100', text: 'text-red-700' },
            ].map((tier) => {
              const pct = studentsWithData.length ? Math.round((tier.count / studentsWithData.length) * 100) : 0;
              return (
                <div key={tier.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{tier.label}</span>
                    <span className={tier.text}>
                      {tier.count} Students ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${tier.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Cohort Exam Mean</div>
              <div className="text-base font-bold text-slate-800">{avgMarks}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Avg Study Hours</div>
              <div className="text-base font-bold text-slate-800">
                {avgStudy} {avgStudy !== 'N/A' && <span className="text-xs font-normal">hrs/wk</span>}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <div className="text-xs text-slate-500">Avg LMS Index</div>
              <div className="text-base font-bold text-slate-800">
                {avgLms} {avgLms !== 'N/A' && <span className="text-xs font-normal">/100</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Action: At-Risk Intervention List */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <span>At-Risk Action Queue</span>
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                {atRiskStudents.length} Students
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Students falling below institutional attendance or exam thresholds
            </p>

            <div className="space-y-2.5">
              {atRiskStudents.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  No at-risk students flagged in the active cohort.
                </div>
              ) : (
                atRiskStudents.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectStudent(s)}
                    className="p-3 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100/60 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold text-slate-900 text-xs">{s.name}</div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded">
                        High Risk
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Att: <strong className="text-red-700">{s.attendance}%</strong> &bull; Exam:{' '}
                      <strong className="text-red-700">{s.previousMarks}%</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('students')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Full Student Roster ({totalStudents})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Predictions & User Management Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ML Inference Feed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Recent ML Predictions</h2>
            <button
              onClick={() => onNavigate('prediction')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Predictor Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No recent predictions logged in memory.
            </div>
          ) : (
            <div className="space-y-2.5">
              {predictions.slice(0, 5).map((p) => (
                <div
                  key={p.id || p.studentId}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">
                      {p.studentName || p.studentId || 'Custom Simulation'}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Conf: {p.confidence}%</span>
                      <span>&bull;</span>
                      <span>Index: {p.scoreIndex}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        p.performance === 'Excellent'
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.performance === 'Good'
                          ? 'bg-blue-100 text-blue-800'
                          : p.performance === 'Average'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.performance}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        p.riskLevel === 'High'
                          ? 'bg-red-600 text-white'
                          : p.riskLevel === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {p.riskLevel} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Accounts Overview */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">User Access Accounts</h2>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{u.name}</div>
                    <div className="text-[11px] text-slate-500">@{u.username} &bull; {u.email}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase bg-slate-200 text-slate-700">
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
