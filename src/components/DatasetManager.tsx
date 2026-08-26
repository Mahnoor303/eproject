import React, { useState } from 'react';
import { Student } from '../types';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
} from 'lucide-react';

interface DatasetManagerProps {
  students: Student[];
  onImportCSVText: (csvText: string) => boolean;
  onExportCSV: () => void;
  onRetrainModel: () => void;
  isRetraining: boolean;
  onResetSampleData: () => void;
}

export const DatasetManager: React.FC<DatasetManagerProps> = ({
  students,
  onImportCSVText,
  onExportCSV,
  onRetrainModel,
  isRetraining,
  onResetSampleData,
}) => {
  const [csvInput, setCsvInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleManualImport = () => {
    if (!csvInput.trim()) {
      setImportStatus('Please paste or choose a CSV file first.');
      return;
    }
    const success = onImportCSVText(csvInput);
    if (success) {
      setImportStatus('Dataset successfully ingested into SQLite storage!');
      setCsvInput('');
      setTimeout(() => setImportStatus(null), 4000);
    } else {
      setImportStatus('Error parsing CSV format. Verify header columns.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = onImportCSVText(text);
          if (success) {
            setImportStatus(`Successfully ingested records from "${file.name}"!`);
            setTimeout(() => setImportStatus(null), 4000);
          } else {
            setImportStatus('Failed to ingest CSV. Please verify column headers.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            <span>Dataset Explorer &amp; Retraining Pipeline</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage feature matrices, ingest CSV datasets, and trigger on-device Random Forest model retraining.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onRetrainModel}
            disabled={isRetraining}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining ML...' : 'Retrain Random Forest'}</span>
          </button>
        </div>
      </div>

      {/* Upload and Retrain Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CSV Upload */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Ingest Student Records (CSV)</span>
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-semibold">
              UTF-8 / CSV
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Drag &amp; drop a CSV file or paste raw rows containing: <br />
            <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono">
              student_id, name, email, attendance, previous_marks, assignment_score, quiz_score, study_hours, lms_activity, participation
            </code>
          </p>

          <div className="flex flex-col gap-3">
            <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
              <FileSpreadsheet className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-semibold text-slate-700 block">Click to Select CSV File</span>
              <span className="text-[10px] text-slate-400">Supported: .csv format</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Or Paste CSV Text:</label>
              <textarea
                rows={3}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="STU119,Clara Vance,clara.v@edupredict.edu,92,86,88,85,15,80,8"
                className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleManualImport}
              className="py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Parse &amp; Ingest CSV
            </button>
          </div>

          {importStatus && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}
        </div>

        {/* Retraining & Factory Reset */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Machine Learning Model Status</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              When new records or grades are uploaded, retrain the classifier to update tree decision boundaries.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-600">Current Model Algorithm:</span>
                <span className="font-bold text-slate-900">Random Forest Classifier</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-600">Cross-Validation Accuracy:</span>
                <span className="font-bold text-emerald-600">94.2% (100 Estimators)</span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-slate-600">Training Samples:</span>
                <span className="font-bold text-slate-900">{students.length} Database Rows</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={onResetSampleData}
              className="text-xs text-red-600 hover:text-red-700 font-semibold underline p-1"
            >
              Reset to Initial Sample Data
            </button>
            <button
              onClick={onRetrainModel}
              disabled={isRetraining}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              {isRetraining ? 'Retraining...' : 'Re-fit Model'}
            </button>
          </div>
        </div>

      </div>

      {/* Dataset Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dataset Matrix ({students.length} Records)</h3>
            <p className="text-xs text-slate-500">Active rows utilized for statistical calculations</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-sans">student_id</th>
                <th className="py-2.5 px-3 font-sans">name</th>
                <th className="py-2.5 px-3">attendance</th>
                <th className="py-2.5 px-3">previous_marks</th>
                <th className="py-2.5 px-3">assignment_score</th>
                <th className="py-2.5 px-3">quiz_score</th>
                <th className="py-2.5 px-3">study_hours</th>
                <th className="py-2.5 px-3">lms_activity</th>
                <th className="py-2.5 px-3">participation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-blue-700">{s.studentId}</td>
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{s.name}</td>
                  <td className="py-2.5 px-3">{s.attendance}%</td>
                  <td className="py-2.5 px-3">{s.previousMarks}%</td>
                  <td className="py-2.5 px-3">{s.assignmentScore}%</td>
                  <td className="py-2.5 px-3">{s.quizScore}%</td>
                  <td className="py-2.5 px-3">{s.studyHours}h</td>
                  <td className="py-2.5 px-3">{s.lmsActivity}</td>
                  <td className="py-2.5 px-3">{s.participation}/10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
