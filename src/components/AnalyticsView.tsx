import React from 'react';
import { Student } from '../types';
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Users,
  Target,
  BarChart3,
  Calendar,
  FileCheck2,
} from 'lucide-react';

interface AnalyticsViewProps {
  students: Student[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ students }) => {
  const totalRegistered = students.length;
  const studentsWithData = students.filter(
    (s) => s.attendance !== null && s.previousMarks !== null
  );
  const evaluatedCount = studentsWithData.length;

  if (totalRegistered === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Analytics Data Available</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Add or import student records to view cohort-wide statistical distributions.
        </p>
      </div>
    );
  }

  const avgAttendance = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.attendance ?? 0), 0) / evaluatedCount).toFixed(1)
    : 'N/A';
  const avgMarks = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.previousMarks ?? 0), 0) / evaluatedCount).toFixed(1)
    : 'N/A';
  const avgAssignments = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.assignmentScore ?? 0), 0) / evaluatedCount).toFixed(1)
    : 'N/A';
  const avgQuizzes = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.quizScore ?? 0), 0) / evaluatedCount).toFixed(1)
    : 'N/A';
  const avgStudy = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.studyHours ?? 0), 0) / evaluatedCount).toFixed(1)
    : 'N/A';
  const avgLms = evaluatedCount
    ? (studentsWithData.reduce((a, s) => a + (s.lmsActivity ?? 0), 0) / evaluatedCount).toFixed(0)
    : 'N/A';

  // Attendance Brackets (calculated only for students who submitted attendance)
  const attBrackets = {
    'Critical (<60%)': studentsWithData.filter((s) => (s.attendance ?? 100) < 60).length,
    'Moderate (60-74%)': studentsWithData.filter((s) => (s.attendance ?? 0) >= 60 && (s.attendance ?? 0) < 75).length,
    'Good (75-89%)': studentsWithData.filter((s) => (s.attendance ?? 0) >= 75 && (s.attendance ?? 0) < 90).length,
    'Excellent (>=90%)': studentsWithData.filter((s) => (s.attendance ?? 0) >= 90).length,
  };

  // Performance Categories (calculated only for evaluated records)
  const perfCats = {
    Excellent: studentsWithData.filter((s) => (s.previousMarks ?? 0) >= 85 && (s.attendance ?? 0) >= 80).length,
    Good: studentsWithData.filter((s) => (s.previousMarks ?? 0) >= 70 && (s.previousMarks ?? 0) < 85 && (s.attendance ?? 0) >= 70).length,
    Average: studentsWithData.filter((s) => (s.previousMarks ?? 0) >= 50 && (s.previousMarks ?? 0) < 70 && (s.attendance ?? 0) >= 60).length,
    'At Risk': studentsWithData.filter((s) => (s.previousMarks ?? 100) < 50 || (s.attendance ?? 100) < 60).length,
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cohort Visual Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical distribution and cohort risk profiling ({evaluatedCount} submitted records out of {totalRegistered} registered).
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
          Evaluated Cohort: <strong>{evaluatedCount} / {totalRegistered} Students</strong>
        </div>
      </div>

      {/* Cohort Averages Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mean Attendance</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgAttendance}{avgAttendance !== 'N/A' && '%'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">&ge;75% Target</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Exam Mean</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgMarks}{avgMarks !== 'N/A' && '%'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Midterm avg</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Assignments</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgAssignments}{avgAssignments !== 'N/A' && '%'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Homework avg</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Quiz Mean</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgQuizzes}{avgQuizzes !== 'N/A' && '%'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Weekly checks</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Study Time</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgStudy}{avgStudy !== 'N/A' && 'h'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Weekly hours</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">LMS Activity</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {avgLms}{avgLms !== 'N/A' && '/100'}
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Portal score</span>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attendance Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Attendance Distribution Tiers</h2>
              <p className="text-xs text-slate-500">Student count per attendance threshold ({evaluatedCount} records)</p>
            </div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {Object.entries(attBrackets).map(([tier, count]) => {
              const pct = evaluatedCount ? Math.round((count / evaluatedCount) * 100) : 0;
              const isCrit = tier.includes('Critical');
              const isMod = tier.includes('Moderate');
              const isGood = tier.includes('Good');

              return (
                <div key={tier} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{tier}</span>
                    <span className="font-mono text-slate-600">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit
                          ? 'bg-red-500'
                          : isMod
                          ? 'bg-amber-500'
                          : isGood
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Performance Tiers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Overall Academic Standing</h2>
              <p className="text-xs text-slate-500">Classification across {evaluatedCount} evaluated records</p>
            </div>
            <Target className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {Object.entries(perfCats).map(([cat, count]) => {
              const pct = evaluatedCount ? Math.round((count / evaluatedCount) * 100) : 0;
              const isCrit = cat === 'At Risk';
              const isAvg = cat === 'Average';
              const isGood = cat === 'Good';

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="font-mono text-slate-600">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCrit
                          ? 'bg-red-500'
                          : isAvg
                          ? 'bg-amber-500'
                          : isGood
                          ? 'bg-blue-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Correlation Matrix Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Academic Metric Benchmarks &amp; Health</h2>
        <p className="text-xs text-slate-500 mb-4">Target vs actual cohort performance indicators</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Metric</th>
                <th className="py-2.5 px-3">Cohort Average</th>
                <th className="py-2.5 px-3">Institution Benchmark</th>
                <th className="py-2.5 px-3">Standard Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Attendance Rate</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  {avgAttendance}{avgAttendance !== 'N/A' && '%'}
                </td>
                <td className="py-2.5 px-3 text-slate-500">&ge; 75.0%</td>
                <td className="py-2.5 px-3">
                  {avgAttendance === 'N/A' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      No Data
                    </span>
                  ) : (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      Number(avgAttendance) >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {Number(avgAttendance) >= 75 ? 'Healthy' : 'Deficit Alert'}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Assignment Completion Score</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  {avgAssignments}{avgAssignments !== 'N/A' && '%'}
                </td>
                <td className="py-2.5 px-3 text-slate-500">&ge; 70.0%</td>
                <td className="py-2.5 px-3">
                  {avgAssignments === 'N/A' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      No Data
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Compliant
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Weekly Self-Study Effort</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  {avgStudy}{avgStudy !== 'N/A' && ' hrs/wk'}
                </td>
                <td className="py-2.5 px-3 text-slate-500">&ge; 10.0 hrs</td>
                <td className="py-2.5 px-3">
                  {avgStudy === 'N/A' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      No Data
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Sufficient
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">LMS Platform Index</td>
                <td className="py-2.5 px-3 font-bold text-slate-800">
                  {avgLms}{avgLms !== 'N/A' && '/100'}
                </td>
                <td className="py-2.5 px-3 text-slate-500">&ge; 60/100</td>
                <td className="py-2.5 px-3">
                  {avgLms === 'N/A' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      No Data
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Active
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
