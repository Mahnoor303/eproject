import React, { useState } from 'react';
import { SupportTicket, User } from '../types';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  HelpCircle,
  Cpu,
  BookOpen,
  Terminal,
} from 'lucide-react';

interface SupportPortalProps {
  currentUser: User;
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
  onOpenOfflineGuide: () => void;
}

export const SupportPortal: React.FC<SupportPortalProps> = ({
  currentUser,
  tickets,
  onSubmitTicket,
  onOpenOfflineGuide,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSubmitTicket({
      name: currentUser.name,
      email: currentUser.email,
      subject: subject.trim() || 'General Inquiry',
      message: message.trim(),
      status: 'Open',
    });

    setSubject('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LifeBuoy className="w-6 h-6 text-blue-600" />
          <span>Documentation &amp; Support Hub</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit feedback, review technical specifications, and inspect local pipeline documentation.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Support Inquiry Form */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Submit Support Ticket / Feedback</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Topic</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Model weight adjustment question"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Question *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry, bug report, or analytical question..."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit In-App Ticket</span>
            </button>
          </form>

          {submitted && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ticket logged successfully in SQLite database!</span>
            </div>
          )}
        </div>

        {/* Technical FAQ & Local Specs */}
        <div className="space-y-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>System &amp; ML Architecture Specs</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>ML Model:</strong> scikit-learn <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">RandomForestClassifier(n_estimators=100)</code>
              </p>
              <p>
                <strong>Inference Features:</strong> Attendance (20%), Previous Exam Marks (25%), Assignment Average (15%), Quiz Score (15%), Study Hours (10%), LMS Activity (10%), Participation (5%).
              </p>
              <p>
                <strong>Target Classifications:</strong>
                <span className="text-emerald-700 font-semibold ml-1">Excellent</span>,
                <span className="text-blue-700 font-semibold ml-1">Good</span>,
                <span className="text-amber-700 font-semibold ml-1">Average</span>,
                <span className="text-red-700 font-semibold ml-1">At Risk</span>.
              </p>
              <p>
                <strong>Zero-Cloud Guarantee:</strong> All machine learning scoring, database caching, and CSV ingestion run completely locally on-device.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={onOpenOfflineGuide}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Python Flask Offline Commands</span>
              </button>
            </div>
          </div>

          {/* Ticket History */}
          {tickets.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Support Inquiries ({tickets.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-slate-900">{t.subject}</strong>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mb-1">By: {t.name} &bull; {t.createdAt}</div>
                    <p className="text-slate-600 text-[11px]">{t.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
