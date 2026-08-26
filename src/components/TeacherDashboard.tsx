import React from 'react';
import { Student, MLPredictionResult } from '../types';
import {
  BookOpen,
  Users,
  ShieldAlert,
  BrainCircuit,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface TeacherDashboardProps {
  students: Student[];
  predictions: MLPredictionResult[];
  onOpenAddStudent: () => void;
  onNavigate: (tab: any) => void;
  onSelectStudent: (student: Student) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  predictions,
  onOpenAddStudent,
  onNavigate,
  onSelectStudent,
}) => {
  const total = students.length;
  const studentsWithData = students.filter(
    (s) => s.attendance !== null && s.previousMarks !== null
  );

  const atRisk = studentsWithData.filter(
    (s) => s.attendance! < 65 || s.previousMarks! < 50
  );

  const avgAtt = studentsWithData.length
    ? (studentsWithData.reduce((a, s) => a + (s.attendance ?? 0), 0) / studentsWithData.length).toFixed(1) + '%'
    : 'N/A';

  const avgMarks = studentsWithData.length
    ? (studentsWithData.reduce((a, s) => a + (s.previousMarks ?? 0), 0) / studentsWithData.length).toFixed(1) + '%'
    : 'N/A';

  return (
    <div className="space-y-6">
      
      {/* Teacher Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Teacher Classroom Command</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Active Class Cohort &amp; At-Risk Alerts</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Monitor classroom attendance, flag struggling students before exams, and simulate targeted intervention plans.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenAddStudent}
            className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
          <button
            onClick={() => onNavigate('prediction')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all border border-emerald-400/40 flex items-center gap-1.5"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Predict Grades</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{total} Students</div>
          <div className="text-xs text-slate-500 mt-1">
            {studentsWithData.length} with submitted records
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">At-Risk Count</span>
          <div className="text-2xl font-bold text-red-600 mt-2">{atRisk.length}</div>
          <div className="text-xs text-red-600 font-semibold mt-1">Requires immediate feedback</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Avg Attendance</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{avgAtt}</div>
          <div className="text-xs text-slate-500 mt-1">
            {studentsWithData.length ? 'Weekly roll call average' : 'No submitted attendance'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Midterm Mean</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{avgMarks}</div>
          <div className="text-xs text-slate-500 mt-1">
            {studentsWithData.length ? 'Target benchmark: ≥ 70%' : 'No submitted exam marks'}
          </div>
        </div>
      </div>

      {/* Classroom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* At-Risk Intervention Panel */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Struggling Students</span>
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
              {atRisk.length} Urgent
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Action items recommended by the AI risk classification model:
          </p>

          <div className="space-y-2.5">
            {atRisk.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                No struggling students flagged in the active cohort.
              </div>
            ) : (
              atRisk.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="p-3 rounded-lg border border-red-200 bg-red-50/40 hover:bg-red-100/50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{s.studentId} &bull; {s.email}</div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-600 text-white rounded">
                      High Risk
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                    <div className="text-slate-600">
                      Attendance:{' '}
                      <strong className="text-red-600">
                        {s.attendance !== null ? `${s.attendance}%` : 'Not Provided'}
                      </strong>
                    </div>
                    <div className="text-slate-600">
                      Exam:{' '}
                      <strong className="text-red-600">
                        {s.previousMarks !== null ? `${s.previousMarks}%` : 'Not Provided'}
                      </strong>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-red-800 bg-white/80 p-1.5 rounded border border-red-100">
                    <strong>Intervention:</strong> Provide quiz revision packet &amp; schedule 1-on-1 office hour.
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Student Roster Preview */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Enrolled Student Cohort</h2>
              <p className="text-xs text-slate-500">Quick view and direct access to academic evaluations</p>
            </div>
            <button
              onClick={() => onNavigate('students')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Manage All ({total})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Attendance</th>
                  <th className="py-2.5 px-3">Prior Exam</th>
                  <th className="py-2.5 px-3">Assignments</th>
                  <th className="py-2.5 px-3">Study Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 7).map((s) => {
                  const hasData = s.attendance !== null && s.previousMarks !== null;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400">{s.studentId}</div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold">
                        {s.attendance !== null ? (
                          <span className={s.attendance < 65 ? 'text-red-600' : 'text-slate-700'}>
                            {s.attendance}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-semibold">
                        {s.previousMarks !== null ? (
                          <span>{s.previousMarks}%</span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {s.assignmentScore !== null ? (
                          <span>{s.assignmentScore}%</span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {s.studyHours !== null ? (
                          <span>{s.studyHours} hrs/wk</span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200 transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
