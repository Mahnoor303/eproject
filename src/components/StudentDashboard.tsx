import React, { useState } from 'react';
import { Student, MLPredictionResult } from '../types';
import { predictStudentPerformance } from '../utils/mlEngine';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Sliders,
  FileEdit,
  AlertTriangle,
  BrainCircuit,
  Info,
  X,
  Save,
  Check,
} from 'lucide-react';

export interface StudentAcademicData {
  attendance: number;
  previousMarks: number;
  assignmentScore: number;
  quizScore: number;
  studyHours: number;
  lmsActivity: number;
  participation: number;
}

interface StudentDashboardProps {
  student: Student | null | undefined;
  savedPrediction?: MLPredictionResult | null;
  onSaveAcademicInfo: (studentId: string, data: StudentAcademicData) => void;
  onPredictMyPerformance: (student: Student) => void;
  onNavigate: (tab: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  savedPrediction,
  onSaveAcademicInfo,
  onPredictMyPerformance,
  onNavigate,
}) => {
  // Modal state for academic information entry
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Form input state (defaults to student's existing values or empty defaults)
  const [formData, setFormData] = useState<StudentAcademicData>({
    attendance: student?.attendance ?? 80,
    previousMarks: student?.previousMarks ?? 75,
    assignmentScore: student?.assignmentScore ?? 75,
    quizScore: student?.quizScore ?? 75,
    studyHours: student?.studyHours ?? 10,
    lmsActivity: student?.lmsActivity ?? 70,
    participation: student?.participation ?? 7,
  });

  // Interactive "What-If" study slider state
  const [simStudyHours, setSimStudyHours] = useState<number>(student?.studyHours ?? 10);
  const [simAttendance, setSimAttendance] = useState<number>(student?.attendance ?? 75);

  if (!student) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Academic Record Center</h1>
          <p className="text-blue-100 text-xs mt-1">
            Personal performance telemetry and predictive guidance.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-2xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Academic Record Found</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            No academic record has been linked to your student account yet. Please contact support or enter your academic metrics.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('support')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if student has actual submitted academic metrics (not null)
  const hasAcademicData =
    student.attendance !== null &&
    student.previousMarks !== null &&
    student.assignmentScore !== null &&
    student.quizScore !== null &&
    student.studyHours !== null &&
    student.lmsActivity !== null &&
    student.participation !== null;

  // Handle Form Open
  const handleOpenForm = () => {
    setFormData({
      attendance: student.attendance ?? 85,
      previousMarks: student.previousMarks ?? 78,
      assignmentScore: student.assignmentScore ?? 80,
      quizScore: student.quizScore ?? 75,
      studyHours: student.studyHours ?? 12,
      lmsActivity: student.lmsActivity ?? 70,
      participation: student.participation ?? 8,
    });
    setIsFormOpen(true);
    setSaveFeedback(null);
  };

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAcademicInfo(student.studentId, formData);
    setIsFormOpen(false);
    setSaveFeedback('Academic information saved successfully! You can now request an AI prediction.');
    setTimeout(() => setSaveFeedback(null), 5000);
  };

  // Handle explicit prediction request
  const handleRequestPrediction = () => {
    if (!hasAcademicData) {
      handleOpenForm();
      return;
    }
    setIsPredicting(true);
    setTimeout(() => {
      onPredictMyPerformance(student);
      setIsPredicting(false);
    }, 600);
  };

  // "What-If" simulator calculations (only if baseline data exists)
  const simPred = hasAcademicData
    ? predictStudentPerformance({
        attendance: simAttendance,
        previousMarks: student.previousMarks!,
        assignmentScore: student.assignmentScore!,
        quizScore: student.quizScore!,
        studyHours: simStudyHours,
        lmsActivity: student.lmsActivity!,
        participation: student.participation!,
      })
    : null;

  return (
    <div className="space-y-6">
      
      {/* Student Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-black">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-semibold mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student ID: {student.studentId}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">{student.name}</h1>
            <p className="text-blue-100 text-xs mt-0.5">{student.email} &bull; Personal Student Dashboard</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenForm}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-xs"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{hasAcademicData ? 'Update Academic Info' : 'Enter My Academic Information'}</span>
          </button>

          {hasAcademicData && (
            <button
              onClick={handleRequestPrediction}
              disabled={isPredicting}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <BrainCircuit className={`w-4 h-4 ${isPredicting ? 'animate-spin' : ''}`} />
              <span>{savedPrediction ? 'Re-run Prediction' : 'Predict My Performance'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success / Feedback Banner */}
      {saveFeedback && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
          {hasAcademicData && !savedPrediction && (
            <button
              onClick={handleRequestPrediction}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors"
            >
              Predict Now &rarr;
            </button>
          )}
        </div>
      )}

      {/* Empty State Banner (If no academic data submitted yet) */}
      {!hasAcademicData && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">Academic Profile Incomplete</h3>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Your academic information has not been submitted yet. Please enter your information to receive an AI performance prediction.
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenForm}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
            >
              <FileEdit className="w-4 h-4" />
              <span>Enter My Academic Information</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Academic Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Attendance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {hasAcademicData ? `${student.attendance}%` : (
              <span className="text-base text-slate-400 font-normal">0 / Not Provided</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {hasAcademicData ? 'Institutional benchmark: ≥ 75%' : 'No attendance data recorded'}
          </div>
        </div>

        {/* Previous Marks / Midterm */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Previous Marks</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {hasAcademicData ? `${student.previousMarks}%` : (
              <span className="text-base text-slate-400 font-normal">0 / Not Provided</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {hasAcademicData ? 'Prior exam & continuous score' : 'No examination score recorded'}
          </div>
        </div>

        {/* Assignment & Quiz Averages */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assignment / Quiz</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {hasAcademicData ? `${student.assignmentScore}% / ${student.quizScore}%` : (
              <span className="text-base text-slate-400 font-normal">0 / Not Provided</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {hasAcademicData ? 'Homework and module quiz averages' : 'No coursework scores submitted'}
          </div>
        </div>

        {/* Weekly Study Hours & LMS Activity */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Time &amp; LMS</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {hasAcademicData ? (
              <span>{student.studyHours}h <span className="text-xs font-normal text-slate-400">&bull; {student.lmsActivity}/100</span></span>
            ) : (
              <span className="text-base text-slate-400 font-normal">0 / Not Provided</span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {hasAcademicData ? `Participation Index: ${student.participation}/10` : 'No study metrics submitted'}
          </div>
        </div>

      </div>

      {/* AI Machine Learning Classification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Performance &amp; Risk Telemetry</h2>
              <p className="text-xs text-slate-500">Supervised classification based on verified academic parameters</p>
            </div>
          </div>

          {savedPrediction && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Model Inferred</span>
            </span>
          )}
        </div>

        {/* Dynamic Status Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* AI Prediction Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">AI Prediction</div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {savedPrediction ? savedPrediction.performance : 'No prediction available'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {savedPrediction ? 'Random Forest Classification' : 'Pending profile submission & calculation'}
            </div>
          </div>

          {/* Risk Level Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Risk Level</div>
            <div className="text-lg font-extrabold mt-1">
              {savedPrediction ? (
                <span
                  className={
                    savedPrediction.riskLevel === 'Low'
                      ? 'text-emerald-600'
                      : savedPrediction.riskLevel === 'Medium'
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }
                >
                  {savedPrediction.riskLevel} Risk
                </span>
              ) : (
                <span className="text-slate-900">No risk assessment available</span>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {savedPrediction ? 'Early warning flag status' : 'No risk assessment calculated'}
            </div>
          </div>

          {/* Model Confidence */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Confidence</div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {savedPrediction ? `${savedPrediction.confidence}%` : 'N/A'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {savedPrediction ? 'Cross-validated probability score' : 'Not calculated'}
            </div>
          </div>

        </div>

        {/* Sub-Panel: If prediction is available vs if not available */}
        {!savedPrediction ? (
          <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">
                {hasAcademicData
                  ? 'Ready for Performance Inference'
                  : 'No prediction available yet.'}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {hasAcademicData
                  ? 'Your academic data is saved in the database. Click the button below to execute the Machine Learning pipeline.'
                  : 'To receive a tailored grade prediction and proactive academic advisory, enter your current semester metrics.'}
              </p>
            </div>
            <div>
              {hasAcademicData ? (
                <button
                  onClick={handleRequestPrediction}
                  disabled={isPredicting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>{isPredicting ? 'Running ML Model...' : 'Predict My Performance'}</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenForm}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
                >
                  <FileEdit className="w-4 h-4" />
                  <span>Enter My Academic Information</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Active Prediction Guidance and Breakdown */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* AI Tailored Guidance */}
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
                <strong className="text-blue-900 block mb-1 font-bold">Model Synthesis:</strong>
                {savedPrediction.explanation}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Recommended Study Actions:</h4>
                <div className="space-y-2">
                  {savedPrediction.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Drivers */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Drivers &amp; Feature Flags:</h4>
                <div className="space-y-1.5">
                  {savedPrediction.keyDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-2 rounded-lg border flex items-center justify-between ${
                        driver.impact === 'positive'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : driver.impact === 'negative'
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span className="font-semibold">{driver.feature}</span>
                      <span className="text-[11px] opacity-90">{driver.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive "What-If" Simulator */}
            {simPred && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">What-If Grade Simulator</h3>
                    <p className="text-[11px] text-slate-500">Adjust parameters to see projected grade trajectory</p>
                  </div>
                </div>

                {/* Slider 1: Study Hours */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Simulated Weekly Study Time:</span>
                    <span className="text-blue-600 font-bold">{simStudyHours} Hours/Week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="35"
                    step="1"
                    value={simStudyHours}
                    onChange={(e) => setSimStudyHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Slider 2: Attendance */}
                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Simulated Attendance:</span>
                    <span className="text-blue-600 font-bold">{simAttendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="1"
                    value={simAttendance}
                    onChange={(e) => setSimAttendance(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Simulation Result */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Simulated Outcome</div>
                      <div className="text-lg font-extrabold text-white">{simPred.performance}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        simPred.riskLevel === 'Low'
                          ? 'bg-emerald-500 text-white'
                          : simPred.riskLevel === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {simPred.riskLevel} Risk
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 pt-1 border-t border-white/10">
                    Estimated Composite Index: <strong className="text-white">{simPred.scoreIndex} / 100</strong>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* STUDENT ACADEMIC INFORMATION ENTRY MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  <FileEdit className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {hasAcademicData ? 'Update Academic Information' : 'Enter Academic Information'}
                  </h2>
                  <p className="text-xs text-slate-500">Student: {student.name} ({student.studentId})</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Please enter your real academic indicators. Saving this form will record your academic information in the database.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attendance Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.attendance}
                    onChange={(e) => setFormData({ ...formData, attendance: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 85"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Previous Exam Marks (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.previousMarks}
                    onChange={(e) => setFormData({ ...formData, previousMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 78"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assignment Score (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.assignmentScore}
                    onChange={(e) => setFormData({ ...formData, assignmentScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 82"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quiz Average Score (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.quizScore}
                    onChange={(e) => setFormData({ ...formData, quizScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weekly Self-Study Time (Hours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    required
                    value={formData.studyHours}
                    onChange={(e) => setFormData({ ...formData, studyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 12"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    LMS Activity Index (0 - 100) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.lmsActivity}
                    onChange={(e) => setFormData({ ...formData, lmsActivity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 75"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Class Participation Rating (1 - 10) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.participation}
                    onChange={(e) => setFormData({ ...formData, participation: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. 8"
                  />
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Academic Information</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
