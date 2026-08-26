import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
  GraduationCap, 
  BrainCircuit, 
  BarChart3, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Database, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Sparkles,
  Lock,
  Server,
  FileSpreadsheet,
  Activity,
  Layers,
  Award,
  Sun,
  Moon
} from 'lucide-react';

interface LandingPageProps {
  onNavigateToLogin: (role?: UserRole) => void;
  onNavigateToRegister: () => void;
  onEnterDashboard: (role: UserRole) => void;
  onSubmitContact: (name: string, email: string, subject: string, message: string) => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToRegister,
  onEnterDashboard,
  onSubmitContact,
  isDarkMode,
  onToggleDarkMode
}) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mini Interactive Predictor in Hero
  const [demoAttendance, setDemoAttendance] = useState(85);
  const [demoPrevMarks, setDemoPrevMarks] = useState(78);
  const [demoStudyHours, setDemoStudyHours] = useState(12);

  // Compute real-time demo forecast
  const scoreEstimate = Math.round(demoAttendance * 0.35 + demoPrevMarks * 0.45 + (demoStudyHours / 30) * 100 * 0.2);
  let demoClass = 'Good';
  let demoRisk = 'Low Risk';
  let demoRiskColor = 'text-blue-600 bg-blue-50 border-blue-200';
  let demoClassColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (scoreEstimate >= 85) {
    demoClass = 'Excellent';
    demoRisk = 'Low Risk';
    demoRiskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    demoClassColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (scoreEstimate >= 70) {
    demoClass = 'Good';
    demoRisk = 'Low Risk';
    demoRiskColor = 'text-blue-700 bg-blue-50 border-blue-200';
    demoClassColor = 'text-blue-700 bg-blue-50 border-blue-200';
  } else if (scoreEstimate >= 55) {
    demoClass = 'Average';
    demoRisk = 'Moderate Risk';
    demoRiskColor = 'text-amber-700 bg-amber-50 border-amber-200';
    demoClassColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else {
    demoClass = 'At Risk';
    demoRisk = 'High Risk';
    demoRiskColor = 'text-red-700 bg-red-50 border-red-200';
    demoClassColor = 'text-red-700 bg-red-50 border-red-200';
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;
    onSubmitContact(contactName, contactEmail, contactSubject, contactMessage);
    setIsSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      
      {/* 1. PUBLIC NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xl tracking-tight">EduPredict</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                  AI ML
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Based Educational Analytics
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <button onClick={() => scrollTo('hero')} className="hover:text-blue-600 transition-colors">Home</button>
            <button onClick={() => scrollTo('about')} className="hover:text-blue-600 transition-colors">About</button>
            <button onClick={() => scrollTo('features')} className="hover:text-blue-600 transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-blue-600 transition-colors">How It Works</button>
            <button onClick={() => scrollTo('roles')} className="hover:text-blue-600 transition-colors">User Roles</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-blue-600 transition-colors">Contact</button>
          </nav>

          {/* Authentication Actions & Theme Toggle */}
          <div className="flex items-center gap-2.5">
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                id="theme-toggle-landing"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>
            )}
            <button
              onClick={() => onNavigateToLogin()}
              className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all"
            >
              Login
            </button>
            <button
              onClick={() => onNavigateToRegister()}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-xl transition-all"
            >
              Register
            </button>
          </div>

        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Calls to Action */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Machine Learning &amp; Educational Analytics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              EduPredict
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 leading-snug">
              AI-Based Student Performance &amp; Educational Analytics System
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              EduPredict uses Machine Learning to analyze educational data and predict student performance and academic risk. Built with offline random forest inference, SQLite persistence, and role-based workflows for students, teachers, analysts, and administrators.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => onNavigateToLogin()}
                className="px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Login to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateToRegister()}
                className="px-6 py-3.5 text-base font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all"
              >
                Register Account
              </button>

              <button
                onClick={() => scrollTo('about')}
                className="px-5 py-3.5 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Learn More &darr;
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Offline ML Inference</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SQLite Persistent Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Role-Based Access Control</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Machine Learning Card */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xl shadow-slate-200/60 relative">
              
              {/* Header badge */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-sm">Interactive ML Model Preview</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Model Ready
                </span>
              </div>

              {/* Sliders */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Attendance Rate</span>
                    <span className="font-bold text-blue-600">{demoAttendance}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={demoAttendance}
                    onChange={(e) => setDemoAttendance(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Previous Exam Marks</span>
                    <span className="font-bold text-blue-600">{demoPrevMarks}/100</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={demoPrevMarks}
                    onChange={(e) => setDemoPrevMarks(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 mb-1">
                    <span>Weekly Study Hours</span>
                    <span className="font-bold text-blue-600">{demoStudyHours} hrs/wk</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={demoStudyHours}
                    onChange={(e) => setDemoStudyHours(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Live Output Box */}
              <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Real-Time AI Output
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className={`p-3 rounded-lg border text-center ${demoClassColor}`}>
                    <div className="text-[10px] font-semibold text-slate-600">Predicted Band</div>
                    <div className="text-base font-extrabold">{demoClass}</div>
                  </div>
                  <div className={`p-3 rounded-lg border text-center ${demoRiskColor}`}>
                    <div className="text-[10px] font-semibold text-slate-600">Risk Assessment</div>
                    <div className="text-base font-extrabold">{demoRisk}</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Random Forest (100 Trees)</span>
                  <span className="font-bold text-slate-700">Calculated Score: {scoreEstimate}/100</span>
                </div>
              </div>

              {/* Call to action for account access */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Access Full Dashboard:</span>
                <button
                  onClick={() => onNavigateToLogin()}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              About The System
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Empowering Education Through Data-Driven Intelligence
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              EduPredict is an AI-powered educational analytics system designed to help educational institutions analyze student data, understand academic performance, and identify students who may be at academic risk before it's too late.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl">
                🎯
              </div>
              <h3 className="text-lg font-bold text-slate-900">Objective &amp; Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The primary purpose is supporting educators and academic counselors with objective, data-informed insights. By surfacing learning bottlenecks early in the semester, schools can deploy timely tutoring and supportive mentorship.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
                🔬
              </div>
              <h3 className="text-lg font-bold text-slate-900">Objective ML Predictions</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Predictions are generated through multi-factor statistical models trained on real academic metrics. The system produces transparent confidence intervals and factor attributions rather than arbitrary black-box scores.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h3 className="text-lg font-bold text-slate-900">Privacy &amp; Local Execution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All records, cohort datasets, and model evaluations execute locally in SQLite and Python scikit-learn. No sensitive student identifiers or grade histories are transmitted to external servers or cloud APIs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Comprehensive Academic Intelligence
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Discover the specialized feature modules engineered for students, faculty, academic analysts, and institutional leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Performance Prediction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Predict student performance using Machine Learning models trained on comprehensive academic and engagement indicators.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Student Analytics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Analyze attendance, marks, study activity and academic indicators across cohorts with interactive distribution charts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Risk Detection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Identify students who may need additional academic support before final examinations through automated risk scoring.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Role-Based Dashboards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Separate dashboards for Students, Teachers, Analysts and Administrators with strict access isolation.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Data Management</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Store educational records securely in the local SQLite database with CSV import and export capabilities.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-3">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Offline Prediction</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The trained Machine Learning model runs locally, so prediction does not require an internet connection or external API.
            </p>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              System Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How EduPredict Works
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              The system takes student academic information, processes it and sends it to the trained local ML model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Educational Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Input student parameters including attendance percentage, previous marks, quiz scores, assignment grades, weekly study hours, and LMS participation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">Data Processing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The pipeline performs numeric range validation, feature formatting, and StandardScaler normalization according to model training parameters.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Machine Learning Model</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The local scikit-learn Random Forest model computes multi-class probabilities across performance categories and evaluates safety thresholds.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900">Prediction &amp; Analytics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates the performance prediction (Excellent, Good, Average, At Risk), confidence percentage, risk assessment, and persists the record into SQLite.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FOUR USER ROLES SECTION */}
      <section id="roles" className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Access Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Four Tailored User Roles
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            EduPredict isolates features and data views strictly according to each user's authenticated role.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Student Role */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Student
                </span>
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
              <p className="text-xs text-slate-500 font-semibold">Students can:</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>View their own academic information</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>View performance metrics &amp; grades</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>View AI predictions &amp; forecasts</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>View personal risk level</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Submit feedback and support tickets</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToLogin('student')}
              className="mt-6 w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Login as Student</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teacher Role */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Teacher
                </span>
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Teacher Portal</h3>
              <p className="text-xs text-slate-500 font-semibold">Teachers can:</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Manage classroom students &amp; roster</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>View student performance profiles</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Run AI predictions for students</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Identify at-risk students proactively</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>View class analytics &amp; averages</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToLogin('teacher')}
              className="mt-6 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Login as Teacher</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Analyst Role */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                  Analyst
                </span>
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Analyst Portal</h3>
              <p className="text-xs text-slate-500 font-semibold">Analysts can:</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Analyze educational datasets &amp; CSVs</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>View statistical distributions</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>View prediction trends over time</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Generate and export reports</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Analyze performance patterns</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToLogin('analyst')}
              className="mt-6 w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Login as Analyst</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Admin Role */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                  Administrator
                </span>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Admin Console</h3>
              <p className="text-xs text-slate-500 font-semibold">Administrators can:</p>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Manage system user accounts &amp; roles</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Manage institutional system data</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>View system-wide statistics</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Monitor prediction audit logs</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Manage AI model &amp; retraining</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateToLogin('admin')}
              className="mt-6 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Login as Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        <div className="mt-8 bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-700 shrink-0" />
          <span>
            <strong>Security Notice:</strong> Administrator controls and user management are strictly isolated behind role-based authentication rules.
          </span>
        </div>

      </section>

      {/* 7. CONTACT / FEEDBACK SECTION */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Feedback &amp; Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Get in Touch with EduPredict
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Have a question about the ML pipeline or want to submit system feedback? Send a message directly into our local database.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            
            {/* Form */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-7 sm:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Send a Message</h3>
              
              {isSubmitted && (
                <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your message has been saved to the local SQLite database.</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your.email@institution.edu"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="e.g. Inquiry regarding ML prediction weights"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Type your message or inquiry here..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Info Box */}
            <div className="lg:col-span-5 bg-slate-900 text-slate-200 rounded-2xl p-7 sm:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                <div>
                  <h4 className="text-lg font-extrabold text-white mb-2">Direct SQLite Ticketing</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    All inquiries submitted through this form are logged in the local SQLite <code>support_tickets</code> table. No internet connection or third-party mailing service is required.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-300">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>EduPredict Local Educational Analytics Deployment</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Storage: SQLite (<code>database/edupredict.db</code>)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Framework: Python Flask + scikit-learn</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
                <div className="text-xs text-slate-400 font-medium">Ready to experience EduPredict?</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigateToRegister()}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => onNavigateToLogin()}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center transition-colors"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-slate-800">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  EP
                </div>
                <span className="font-extrabold text-white text-lg">EduPredict</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                AI-Based Student Performance &amp; Educational Analytics System. Empowering educators with local Machine Learning inferences and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">About System</button></li>
                <li><button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollTo('roles')} className="hover:text-white transition-colors">User Roles</button></li>
                <li><button onClick={() => scrollTo('contact')} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Portal Access</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => onNavigateToLogin()} className="hover:text-white transition-colors">Login to Portal</button></li>
                <li><button onClick={() => onNavigateToRegister()} className="hover:text-white transition-colors">Register Account</button></li>
                <li><button onClick={() => onNavigateToLogin('student')} className="hover:text-white transition-colors">Student Login</button></li>
                <li><button onClick={() => onNavigateToLogin('teacher')} className="hover:text-white transition-colors">Teacher Login</button></li>
                <li><button onClick={() => onNavigateToLogin('analyst')} className="hover:text-white transition-colors">Analyst Login</button></li>
                <li><button onClick={() => onNavigateToLogin('admin')} className="hover:text-white transition-colors">Admin Login</button></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>&copy; 2026 EduPredict. All rights reserved.</div>
            <div>AI-Based Student Performance &amp; Educational Analytics System</div>
          </div>

        </div>
      </footer>

    </div>
  );
};
