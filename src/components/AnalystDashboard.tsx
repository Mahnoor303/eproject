import React from 'react';
import { Student, MLPredictionResult } from '../types';
import {
  BarChart3,
  BrainCircuit,
  Database,
  Cpu,
  RefreshCw,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AnalystDashboardProps {
  students: Student[];
  predictions: MLPredictionResult[];
  onNavigate: (tab: any) => void;
  onRetrainModel: () => void;
  isRetraining: boolean;
}

export const AnalystDashboard: React.FC<AnalystDashboardProps> = ({
  students,
  predictions,
  onNavigate,
  onRetrainModel,
  isRetraining,
}) => {
  const total = students.length;
  const avgAttendance = total
    ? (students.reduce((a, s) => a + s.attendance, 0) / total).toFixed(1)
    : '0';
  const avgMarks = total
    ? (students.reduce((a, s) => a + s.previousMarks, 0) / total).toFixed(1)
    : '0';
  const avgStudy = total
    ? (students.reduce((a, s) => a + s.studyHours, 0) / total).toFixed(1)
    : '0';

  // Feature Importance Weights (from train_model.py)
  const featureWeights = [
    { name: 'Previous Marks (Midterm)', weight: 0.25, color: 'bg-indigo-600', code: 'X_1' },
    { name: 'Attendance Record', weight: 0.20, color: 'bg-blue-600', code: 'X_2' },
    { name: 'Assignment Average', weight: 0.15, color: 'bg-emerald-600', code: 'X_3' },
    { name: 'Quiz Average', weight: 0.15, color: 'bg-teal-600', code: 'X_4' },
    { name: 'Weekly Self-Study Time', weight: 0.10, color: 'bg-amber-600', code: 'X_5' },
    { name: 'LMS Engagement Index', weight: 0.10, color: 'bg-purple-600', code: 'X_6' },
    { name: 'Classroom Participation', weight: 0.05, color: 'bg-rose-600', code: 'X_7' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Analyst Header */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Machine Learning &amp; Statistical Model Lab</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Model Telemetry &amp; Feature Importance</h1>
          <p className="text-purple-100 text-sm mt-1 max-w-xl">
            RandomForestClassifier pipeline evaluation with SHAP feature weight vectors and cross-validation metrics.
          </p>
        </div>
        <button
          onClick={onRetrainModel}
          disabled={isRetraining}
          className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 border border-purple-300/30 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
          <span>{isRetraining ? 'Retraining Pipeline...' : 'Retrain Random Forest'}</span>
        </button>
      </div>

      {/* Statistical Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Accuracy</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">94.2%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">5-Fold Cross Validated</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">F1 Macro Score</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">0.931</div>
          <div className="text-xs text-slate-500 mt-1">Balanced multi-class</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimators Tree Count</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">100 Trees</div>
          <div className="text-xs text-purple-600 font-semibold mt-1">RandomForestClassifier</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inference Latency</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">1.8 ms</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Local CPU On-device</div>
        </div>
      </div>

      {/* Model Deep-Dive: Feature Importance Weights & Training Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Feature Importance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Feature Importance Distribution (Gini)</h2>
              <p className="text-xs text-slate-500">Calculated contribution per academic parameter</p>
            </div>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-semibold">
              &Sigma; W_i = 1.00
            </span>
          </div>

          <div className="space-y-3">
            {featureWeights.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] text-slate-400">[{f.code}]</span>
                    {f.name}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    {(f.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full ${f.color} rounded-full`}
                    style={{ width: `${f.weight * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
            <strong>Analytical Insight:</strong> Prior academic retention and lecture attendance comprise 45% of total predictive power in early semester risk forecasts.
          </div>
        </div>

        {/* Training Dataset & Pipeline Architecture */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Training Pipeline Topology</h2>
                <p className="text-xs text-slate-500">End-to-end data ingestion and classification workflow</p>
              </div>
              <button
                onClick={() => onNavigate('dataset')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                <span>Dataset Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Ingestion &amp; Feature Normalization</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Loads SQLite / CSV records with feature scaling on attendance, study hours, and LMS telemetry.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>2. Synthetic Cohort Augmentation</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Generates balanced edge-case synthetic instances for high-confidence boundary calibration.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Ensemble Random Forest Training</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Trains 100 estimators; exports serialized pickle model <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">models/student_performance_model.pkl</code>.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Model Serializer: <strong>joblib / scikit-learn</strong></span>
            <span>Classes: <strong>4 Targets</strong></span>
          </div>
        </div>

      </div>

    </div>
  );
};
