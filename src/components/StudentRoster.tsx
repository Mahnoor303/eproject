import React, { useState } from 'react';
import { Student } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  BrainCircuit,
  Eye,
  Download,
  Upload,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface StudentRosterProps {
  students: Student[];
  onAddStudent: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: number) => void;
  onPredictForStudent: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  onExportCSV: () => void;
  onImportCSV: () => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  onAddStudent,
  onEditStudent,
  onDeleteStudent,
  onPredictForStudent,
  onViewStudent,
  onExportCSV,
  onImportCSV,
}) => {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low' | 'unsubmitted'>('all');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const hasData = s.attendance !== null && s.previousMarks !== null;
    const isHigh = hasData && ((s.attendance ?? 100) < 65 || (s.previousMarks ?? 100) < 50);
    const isMedium = hasData && !isHigh && ((s.attendance ?? 100) < 75 || (s.previousMarks ?? 100) < 65);
    const isLow = hasData && !isHigh && !isMedium;

    if (riskFilter === 'unsubmitted') return matchesSearch && !hasData;
    if (riskFilter === 'high') return matchesSearch && isHigh;
    if (riskFilter === 'medium') return matchesSearch && isMedium;
    if (riskFilter === 'low') return matchesSearch && isLow;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Academic Roster</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {students.length} students enrolled in active predictive cohort
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onImportCSV}
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={onAddStudent}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID (e.g. STU102), email..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>

          <button
            onClick={() => setRiskFilter('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              riskFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>

          <button
            onClick={() => setRiskFilter('high')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              riskFilter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span>High Risk</span>
          </button>

          <button
            onClick={() => setRiskFilter('medium')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              riskFilter === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Moderate
          </button>

          <button
            onClick={() => setRiskFilter('low')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              riskFilter === 'low'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Low Risk
          </button>

          <button
            onClick={() => setRiskFilter('unsubmitted')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              riskFilter === 'unsubmitted'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            No Data
          </button>
        </div>

      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Attendance</th>
                <th className="py-3 px-3">Prev Exam</th>
                <th className="py-3 px-3">Assignments</th>
                <th className="py-3 px-3">Quizzes</th>
                <th className="py-3 px-3">Study Time</th>
                <th className="py-3 px-3">LMS Index</th>
                <th className="py-3 px-3">Risk Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No students matched the criteria "{search}".
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const hasData = s.attendance !== null && s.previousMarks !== null;
                  const isHigh = hasData && ((s.attendance ?? 100) < 65 || (s.previousMarks ?? 100) < 50);
                  const isMed = hasData && !isHigh && ((s.attendance ?? 100) < 75 || (s.previousMarks ?? 100) < 65);

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {s.studentId} &bull; {s.email}
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold">
                        {s.attendance !== null ? (
                          <span className={s.attendance < 65 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                            {s.attendance}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-semibold">
                        {s.previousMarks !== null ? (
                          <span className={s.previousMarks < 50 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                            {s.previousMarks}%
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal italic">Not Provided</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        {s.assignmentScore !== null ? `${s.assignmentScore}%` : <span className="text-slate-400 italic">Not Provided</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {s.quizScore !== null ? `${s.quizScore}%` : <span className="text-slate-400 italic">Not Provided</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {s.studyHours !== null ? `${s.studyHours} hrs/wk` : <span className="text-slate-400 italic">Not Provided</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {s.lmsActivity !== null ? `${s.lmsActivity}/100` : <span className="text-slate-400 italic">Not Provided</span>}
                      </td>

                      <td className="py-3 px-3">
                        {!hasData ? (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            No Data
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isHigh
                                ? 'bg-red-100 text-red-700 border border-red-200'
                                : isMed
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isHigh ? 'High Risk' : isMed ? 'Moderate' : 'Low Risk'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {hasData && (
                            <button
                              onClick={() => onPredictForStudent(s)}
                              title="Run AI ML Prediction"
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
                            >
                              <BrainCircuit className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => onViewStudent(s)}
                            title="View Full Profile"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditStudent(s)}
                            title="Edit Student"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteStudent(s.id)}
                            title="Delete Student"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
