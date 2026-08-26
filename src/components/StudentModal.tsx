import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X, Save, UserPlus, CheckCircle2, ShieldAlert } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: Partial<Student>) => void;
  student: Student | null;
  mode: 'add' | 'edit' | 'view';
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  mode,
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    attendance: 85,
    previousMarks: 75,
    assignmentScore: 80,
    quizScore: 78,
    studyHours: 12,
    lmsActivity: 70,
    participation: 8,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        attendance: student.attendance ?? 85,
        previousMarks: student.previousMarks ?? 75,
        assignmentScore: student.assignmentScore ?? 80,
        quizScore: student.quizScore ?? 78,
        studyHours: student.studyHours ?? 12,
        lmsActivity: student.lmsActivity ?? 70,
        participation: student.participation ?? 8,
      });
    } else {
      setFormData({
        studentId: `STU${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        email: '',
        attendance: 85,
        previousMarks: 75,
        assignmentScore: 80,
        quizScore: 78,
        studyHours: 12,
        lmsActivity: 70,
        participation: 8,
      });
    }
  }, [student, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const isView = mode === 'view';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {mode === 'add' ? <UserPlus className="w-4 h-4" /> : student?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {mode === 'add' ? 'Add New Student Record' : mode === 'edit' ? 'Edit Academic Metrics' : 'Student Academic Profile'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'add' ? 'Input attendance, scores, and study habits' : `ID: ${formData.studentId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID *</label>
                <input
                  type="text"
                  required
                  disabled={isView || mode === 'edit'}
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g. STU118"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  disabled={isView}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
              <input
                type="email"
                disabled={isView}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. elena.r@edupredict.edu"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Predictive Parameters (Features)
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Attendance Rate (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    disabled={isView}
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                  <span className="text-[10px] text-slate-400">Scale: 0 - 100%</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Midterm Exam Marks (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    disabled={isView}
                    value={formData.previousMarks}
                    onChange={(e) => setFormData({ ...formData, previousMarks: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                  <span className="text-[10px] text-slate-400">Prior assessment score</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assignment Average (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    disabled={isView}
                    value={formData.assignmentScore}
                    onChange={(e) => setFormData({ ...formData, assignmentScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Quiz Average (%) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    required
                    disabled={isView}
                    value={formData.quizScore}
                    onChange={(e) => setFormData({ ...formData, quizScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Weekly Study (Hours) *</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    required
                    disabled={isView}
                    value={formData.studyHours}
                    onChange={(e) => setFormData({ ...formData, studyHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">LMS Activity Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    required
                    disabled={isView}
                    value={formData.lmsActivity}
                    onChange={(e) => setFormData({ ...formData, lmsActivity: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">Class Participation (1 - 10) *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  required
                  disabled={isView}
                  value={formData.participation}
                  onChange={(e) => setFormData({ ...formData, participation: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-lg transition-colors"
            >
              {isView ? 'Close' : 'Cancel'}
            </button>
            {!isView && (
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{mode === 'add' ? 'Register Student' : 'Save Changes'}</span>
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
