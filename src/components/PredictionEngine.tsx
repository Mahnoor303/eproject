import React, { useState } from 'react';
import { Student, MLPredictionResult } from '../types';
import { predictStudentPerformance, MLFeatures } from '../utils/mlEngine';
import {
  BrainCircuit,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Save,
  RotateCcw,
  Zap,
  ListFilter,
  Check,
} from 'lucide-react';

interface PredictionEngineProps {
  students: Student[];
  onSavePrediction: (pred: MLPredictionResult) => void;
  selectedStudentPreset?: Student | null;
}

export const PredictionEngine: React.FC<PredictionEngineProps> = ({
  students,
  onSavePrediction,
  selectedStudentPreset,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    selectedStudentPreset?.studentId || ''
  );

  const [features, setFeatures] = useState<MLFeatures>({
    attendance: selectedStudentPreset?.attendance ?? 82,
    previousMarks: selectedStudentPreset?.previousMarks ?? 76,
    assignmentScore: selectedStudentPreset?.assignmentScore ?? 80,
    quizScore: selectedStudentPreset?.quizScore ?? 75,
    studyHours: selectedStudentPreset?.studyHours ?? 12,
    lmsActivity: selectedStudentPreset?.lmsActivity ?? 72,
    participation: selectedStudentPreset?.participation ?? 7,
  });

  const [prediction, setPrediction] = useState<MLPredictionResult | null>(() => {
    return predictStudentPerformance(
      {
        attendance: selectedStudentPreset?.attendance ?? 82,
        previousMarks: selectedStudentPreset?.previousMarks ?? 76,
        assignmentScore: selectedStudentPreset?.assignmentScore ?? 80,
        quizScore: selectedStudentPreset?.quizScore ?? 75,
        studyHours: selectedStudentPreset?.studyHours ?? 12,
        lmsActivity: selectedStudentPreset?.lmsActivity ?? 72,
        participation: selectedStudentPreset?.participation ?? 7,
      },
      selectedStudentPreset?.studentId,
      selectedStudentPreset?.name
    );
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle student autofill selection
  const handleSelectStudent = (sId: string) => {
    setSelectedStudentId(sId);
    if (!sId) return;
    const match = students.find((s) => s.studentId === sId);
    if (match) {
      const newFeat: MLFeatures = {
        attendance: match.attendance ?? 75,
        previousMarks: match.previousMarks ?? 70,
        assignmentScore: match.assignmentScore ?? 75,
        quizScore: match.quizScore ?? 75,
        studyHours: match.studyHours ?? 10,
        lmsActivity: match.lmsActivity ?? 65,
        participation: match.participation ?? 7,
      };
      setFeatures(newFeat);
      const res = predictStudentPerformance(newFeat, match.studentId, match.name);
      setPrediction(res);
      setSavedSuccess(false);
    }
  };

  const handleCalculate = () => {
    const match = students.find((s) => s.studentId === selectedStudentId);
    const res = predictStudentPerformance(
      features,
      match?.studentId,
      match ? match.name : 'Custom Scenario'
    );
    setPrediction(res);
    setSavedSuccess(false);
  };

  const handleSaveToLog = () => {
    if (prediction) {
      onSavePrediction(prediction);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setSelectedStudentId('');
    const defaultFeat = {
      attendance: 82,
      previousMarks: 76,
      assignmentScore: 80,
      quizScore: 75,
      studyHours: 12,
      lmsActivity: 72,
      participation: 7,
    };
    setFeatures(defaultFeat);
    setPrediction(predictStudentPerformance(defaultFeat));
    setSavedSuccess(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
            <span>AI Student Performance Predictor</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-class Random Forest inference simulation with dynamic confidence scoring and SHAP explainability.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Input Form & Sliders (7 Cols) */}
        <div className="lg:col-span-6 space-y-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Input Academic Features</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">X &isin; &reals;^7</span>
          </div>

          {/* Student Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Load from Enrolled Student (Optional):
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => handleSelectStudent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="">-- Custom Simulation / Scratchpad --</option>
              {students.map((s) => (
                <option key={s.id} value={s.studentId}>
                  {s.studentId} — {s.name} (Att: {s.attendance}%, Prev: {s.previousMarks}%)
                </option>
              ))}
            </select>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-4 pt-1">
            
            {/* Attendance */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Attendance Rate (%)</span>
                <span className="font-mono font-bold text-blue-700">{features.attendance}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={features.attendance}
                onChange={(e) => setFeatures({ ...features, attendance: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30%</span>
                <span className="text-red-500 font-medium">Critical &lt;60%</span>
                <span className="text-emerald-600 font-medium">&ge;75% Req</span>
                <span>100%</span>
              </div>
            </div>

            {/* Previous Marks */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Previous Exam / Midterm Marks (%)</span>
                <span className="font-mono font-bold text-blue-700">{features.previousMarks}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={features.previousMarks}
                onChange={(e) => setFeatures({ ...features, previousMarks: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Assignments & Quizzes in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Assignments</span>
                  <span className="font-mono font-bold text-blue-700">{features.assignmentScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={features.assignmentScore}
                  onChange={(e) => setFeatures({ ...features, assignmentScore: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Quiz Average</span>
                  <span className="font-mono font-bold text-blue-700">{features.quizScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={features.quizScore}
                  onChange={(e) => setFeatures({ ...features, quizScore: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Study Hours & LMS Activity in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Study (hrs/wk)</span>
                  <span className="font-mono font-bold text-blue-700">{features.studyHours}h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="0.5"
                  value={features.studyHours}
                  onChange={(e) => setFeatures({ ...features, studyHours: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">LMS Activity</span>
                  <span className="font-mono font-bold text-blue-700">{features.lmsActivity}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={features.lmsActivity}
                  onChange={(e) => setFeatures({ ...features, lmsActivity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            {/* Participation */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Class Participation Rating (1 - 10)</span>
                <span className="font-mono font-bold text-blue-700">{features.participation}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={features.participation}
                onChange={(e) => setFeatures({ ...features, participation: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Compute Inference Model</span>
          </button>

        </div>

        {/* Right Column: Prediction Output Card (5 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {prediction && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5">
              
              {/* Output Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    ML Classification
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5 flex items-center gap-2">
                    <span>{prediction.performance}</span>
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Target: {prediction.studentName || 'Simulation Scenario'}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                      prediction.riskLevel === 'High'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : prediction.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {prediction.riskLevel} Risk
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Score: {prediction.scoreIndex}/100
                  </div>
                </div>
              </div>

              {/* Confidence Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Model Confidence</span>
                  <span className="font-bold text-blue-600">{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Multi-class Probability Breakdown */}
              <div>
                <div className="text-xs font-bold text-slate-700 mb-2">Class Probability Distribution:</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Excellent', val: prediction.probabilities.Excellent, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Good', val: prediction.probabilities.Good, color: 'text-blue-700', bg: 'bg-blue-50' },
                    { label: 'Average', val: prediction.probabilities.Average, color: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'At Risk', val: prediction.probabilities['At Risk'], color: 'text-red-700', bg: 'bg-red-50' },
                  ].map((cls) => (
                    <div key={cls.label} className={`p-2 rounded-lg border border-slate-100 ${cls.bg}`}>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{cls.label}</div>
                      <div className={`text-xs font-black ${cls.color}`}>{cls.val}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Explainability Factor (XAI):</strong>
                {prediction.explanation}
              </div>

              {/* Key Drivers */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700">Identified Factor Drivers:</div>
                {prediction.keyDrivers.map((d, i) => (
                  <div
                    key={i}
                    className={`text-xs p-2 rounded-lg border flex items-center justify-between ${
                      d.impact === 'positive'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : d.impact === 'negative'
                        ? 'bg-red-50/70 border-red-200 text-red-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold">{d.feature}</span>
                    <span className="text-[11px] text-right">{d.description}</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700">Intervention Recommendations:</div>
                {prediction.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSaveToLog}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved to SQLite Log!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Assessment to Log</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
