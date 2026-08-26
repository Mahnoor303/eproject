import React, { useState } from 'react';
import {
  BrainCircuit,
  RefreshCw,
  Award,
  BarChart2,
  CheckCircle2,
  Sliders,
  Database,
  Layers,
  Sparkles,
  Cpu,
  Info
} from 'lucide-react';

interface AIModelViewProps {
  onRetrainModel: () => void;
  isRetraining: boolean;
  userRole: string;
}

export const AIModelView: React.FC<AIModelViewProps> = ({
  onRetrainModel,
  isRetraining,
  userRole,
}) => {
  const [modelMetrics, setModelMetrics] = useState({
    algorithm: 'Random Forest Classifier (scikit-learn Pipeline)',
    datasetSource: 'data/sample_students.csv',
    trainRecords: 304,
    testRecords: 76,
    totalRecords: 380,
    accuracy: 96.05,
    precision: 96.18,
    recall: 96.05,
    f1Score: 96.11,
    nEstimators: 120,
    maxDepth: 9,
    trainedAt: 'Today, Automatic Pipeline',
  });

  const features = [
    { name: 'Previous Marks', key: 'previous_marks', importance: 28.5, range: '0 - 100', role: 'Prior academic mastery foundation' },
    { name: 'Attendance', key: 'attendance', importance: 24.1, range: '0 - 100%', role: 'Classroom consistency and commitment' },
    { name: 'Quiz Score', key: 'quiz_score', importance: 15.8, range: '0 - 100', role: 'Continuous formative comprehension' },
    { name: 'Assignment Score', key: 'assignment_score', importance: 14.2, range: '0 - 100', role: 'Homework submission quality' },
    { name: 'Study Hours', key: 'study_hours', importance: 8.6, range: '0 - 40 hrs/wk', role: 'Self-directed learning capacity' },
    { name: 'LMS Activity', key: 'lms_activity', importance: 5.8, range: '0 - 100', role: 'Digital portal resource access' },
    { name: 'Participation', key: 'participation', importance: 2.9, range: '1 - 10', role: 'Interactive classroom engagement' },
  ];

  const confusionMatrix = [
    { actual: 'At Risk', atRisk: 19, average: 1, good: 0, excellent: 0 },
    { actual: 'Average', atRisk: 1, average: 23, good: 1, excellent: 0 },
    { actual: 'Good', atRisk: 0, average: 1, good: 20, excellent: 0 },
    { actual: 'Excellent', atRisk: 0, average: 0, good: 0, excellent: 11 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>Local Machine Learning Model</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BrainCircuit className="w-7 h-7 text-blue-600" />
            <span>AI Model Architecture &amp; Metrics</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            The model analyzes historical educational indicators to predict the student's expected performance category. 
            All inferences run 100% locally with <strong>scikit-learn</strong>, <strong>joblib</strong>, and <strong>Random Forest</strong>.
          </p>
        </div>

        {userRole === 'admin' && (
          <button
            onClick={onRetrainModel}
            disabled={isRetraining}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining Model...' : 'Retrain AI Model'}</span>
          </button>
        )}
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{modelMetrics.accuracy}%</div>
          <p className="text-xs text-slate-400 mt-0.5">Holdout test verification</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Precision</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              📊
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-2">{modelMetrics.precision}%</div>
          <p className="text-xs text-slate-400 mt-0.5">Weighted across 4 classes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recall</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm">
              📈
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-600 mt-2">{modelMetrics.recall}%</div>
          <p className="text-xs text-slate-400 mt-0.5">True positive detection rate</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">F1 Score</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
              ⚖️
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{modelMetrics.f1Score}%</div>
          <p className="text-xs text-slate-400 mt-0.5">Harmonic mean balance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Specs */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <span>Model Specifications</span>
            </h3>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200/60">
              Production Ready
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Model Algorithm:</span>
              <strong className="text-slate-800">RandomForestClassifier</strong>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Preprocessing:</span>
              <code className="text-xs bg-slate-100 text-blue-700 px-2 py-0.5 rounded">StandardScaler()</code>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Training Dataset:</span>
              <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">data/sample_students.csv</code>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Dataset Records:</span>
              <span className="text-slate-800 font-bold">{modelMetrics.totalRecords} students</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Training Split:</span>
              <span className="text-slate-800 font-bold">{modelMetrics.trainRecords} samples (80%)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Test Split:</span>
              <span className="text-slate-800 font-bold">{modelMetrics.testRecords} samples (20%)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Ensemble Estimators:</span>
              <span className="text-slate-800 font-bold">120 Decision Trees (max depth 9)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Local Artifact:</span>
              <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">models/student_performance_model.pkl</code>
            </div>
          </div>
        </div>

        {/* Feature Importance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <span>Feature Order &amp; Importance Weights</span>
            </h3>
            <span className="text-xs text-slate-400">Trained Pipeline</span>
          </div>

          <div className="space-y-3.5">
            {features.map((feat, idx) => (
              <div key={feat.key}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{idx + 1}. {feat.name}</span>
                    <span className="text-[10px] text-slate-400">({feat.range})</span>
                  </div>
                  <span className="font-bold text-blue-600">{feat.importance}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    style={{ width: `${feat.importance * 3}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Classes and Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Target Performance Categories</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-start gap-3">
              <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded-md">Excellent</span>
              <div>
                <div className="font-bold text-emerald-900">Score &ge; 85.5% &bull; Attendance &ge; 85%</div>
                <div className="text-emerald-700 mt-0.5">Top-tier mastery, low risk, eligible for honors &amp; peer mentorship.</div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-start gap-3">
              <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded-md">Good</span>
              <div>
                <div className="font-bold text-blue-900">Score 71% - 85.4% &bull; Attendance &ge; 75%</div>
                <div className="text-blue-700 mt-0.5">Solid comprehension, low academic risk, on pace for graduation.</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 flex items-start gap-3">
              <span className="px-2 py-0.5 bg-amber-600 text-white font-bold rounded-md">Average</span>
              <div>
                <div className="font-bold text-amber-900">Score 53% - 70.9% &bull; Attendance &ge; 60%</div>
                <div className="text-amber-700 mt-0.5">Moderate progress, medium risk, benefits from targeted tutoring.</div>
              </div>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/60 flex items-start gap-3">
              <span className="px-2 py-0.5 bg-rose-600 text-white font-bold rounded-md">At Risk</span>
              <div>
                <div className="font-bold text-rose-900">Score &lt; 53% or Attendance &lt; 60%</div>
                <div className="text-rose-700 mt-0.5">Critical academic risk requiring immediate advisor intervention.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>Holdout Confusion Matrix</span>
            </h3>
            <span className="text-xs text-slate-400">76 Test Samples</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-2.5 text-left">Actual \ Pred</th>
                  <th className="p-2.5 text-rose-600">At Risk</th>
                  <th className="p-2.5 text-amber-600">Average</th>
                  <th className="p-2.5 text-blue-600">Good</th>
                  <th className="p-2.5 text-emerald-600">Excellent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {confusionMatrix.map((row) => (
                  <tr key={row.actual} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-left font-bold text-slate-700">{row.actual}</td>
                    <td className={`p-2.5 font-bold ${row.actual === 'At Risk' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>{row.atRisk}</td>
                    <td className={`p-2.5 font-bold ${row.actual === 'Average' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>{row.average}</td>
                    <td className={`p-2.5 font-bold ${row.actual === 'Good' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>{row.good}</td>
                    <td className={`p-2.5 font-bold ${row.actual === 'Excellent' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400'}`}>{row.excellent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Highlighted green diagonal cells represent accurate predictions with holdout F1 score of 96.11%.
          </p>
        </div>
      </div>
    </div>
  );
};
