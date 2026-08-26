import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Sparkles, BookOpen, ShieldCheck, Database } from 'lucide-react';

interface OfflineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      title: '1. Install Python Dependencies',
      desc: 'Ensure Python 3.8+ is installed on your local machine, then install the required offline packages:',
      cmd: 'pip install -r requirements.txt',
    },
    {
      title: '2. Train / Initialize ML Model',
      desc: 'Execute the training script to calibrate the Random Forest Classifier on synthetic & sample cohorts:',
      cmd: 'python train_model.py',
    },
    {
      title: '3. Start Local Flask Web Server',
      desc: 'Launch the Flask application with auto-seeded SQLite database on port 5000:',
      cmd: 'python app.py',
    },
    {
      title: '4. Open in Web Browser',
      desc: 'Navigate to the local server in any web browser without internet requirement:',
      cmd: 'http://127.0.0.1:5000',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Local Offline Python Execution Guide</span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  100% Offline
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Run the bundled Flask backend + SQLite + scikit-learn on your computer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Instructions List */}
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-xs font-bold text-slate-800">{step.title}</div>
                <p className="text-xs text-slate-500">{step.desc}</p>
                <div className="flex items-center justify-between bg-slate-900 text-slate-100 rounded-xl px-3.5 py-2 font-mono text-xs border border-slate-800">
                  <span className="text-emerald-400 select-all">{step.cmd}</span>
                  <button
                    onClick={() => copyToClipboard(step.cmd, idx)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Default Credentials Table */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Default Seed User Accounts:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-blue-700">Admin</div>
                <div className="text-[11px] text-slate-600">user: <code className="font-mono">admin</code></div>
                <div className="text-[11px] text-slate-600">pass: <code className="font-mono">admin123</code></div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-emerald-700">Teacher</div>
                <div className="text-[11px] text-slate-600">user: <code className="font-mono">teacher</code></div>
                <div className="text-[11px] text-slate-600">pass: <code className="font-mono">teacher123</code></div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-purple-700">Analyst</div>
                <div className="text-[11px] text-slate-600">user: <code className="font-mono">analyst</code></div>
                <div className="text-[11px] text-slate-600">pass: <code className="font-mono">analyst123</code></div>
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="font-bold text-amber-700">Student</div>
                <div className="text-[11px] text-slate-600">user: <code className="font-mono">student</code></div>
                <div className="text-[11px] text-slate-600">pass: <code className="font-mono">student123</code></div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
