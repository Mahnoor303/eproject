import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  GraduationCap, 
  Lock, 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  BookOpen, 
  BarChart3, 
  Users, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess: (user: User) => void;
  users: User[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
  users,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = loginIdentifier.trim().toLowerCase();
    const password = loginPassword.trim();
    if (!identifier || !password) {
      setErrorMessage('Please enter both your username/email and password.');
      return;
    }

    const found = users.find(
      (u) =>
        (u.username.toLowerCase() === identifier ||
          u.email.toLowerCase() === identifier ||
          (u.role === 'admin' && (identifier === 'admin@gmail.com' || identifier === 'admin'))) &&
        (u.password ? u.password === password : password === `${u.role}123` || password === 'password123' || (u.role === 'admin' && password === 'admin123'))
    );

    if (found) {
      onLoginSuccess(found);
      onClose();
    } else if ((identifier === 'admin@gmail.com' || identifier === 'admin') && password === 'admin123') {
      // Fallback safe login for the system Administrator account
      const adminFallback: User = {
        id: 1,
        username: 'admin',
        name: 'System Administrator',
        role: 'admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        createdAt: '2025-01-10',
      };
      onLoginSuccess(adminFallback);
      onClose();
    } else {
      setErrorMessage('Invalid username/email or password. Please check your credentials and try again.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regUsername.trim() || !regPassword) {
      setErrorMessage('Username and password are required.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setErrorMessage('Username is already taken. Please choose another.');
      return;
    }

    const newUser: User = {
      id: Date.now(),
      username: regUsername.trim(),
      name: regFullName.trim() || regUsername.trim(),
      email: regEmail.trim() || `${regUsername.trim()}@edupredict.edu`,
      password: regPassword,
      role: 'student',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">EduPredict Portal</h2>
              <p className="text-xs text-slate-400">AI-Based Educational Analytics System</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => { setMode('login'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username or Email</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter username or email"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm mt-2"
              >
                Sign In to Dashboard
              </button>

              <div className="text-center pt-2 text-slate-500">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMessage(null); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. s.connor@edupredict.edu"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose unique username"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirm</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm mt-2"
              >
                Complete Registration
              </button>

              <div className="text-center pt-1 text-slate-500">
                <span>Already have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMessage(null); }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
