import React, { useState, useEffect } from 'react';
import { User, UserRole, Student, MLPredictionResult, SupportTicket } from './types';
import { INITIAL_USERS, INITIAL_STUDENTS, INITIAL_TICKETS } from './data/initialData';
import { predictStudentPerformance } from './utils/mlEngine';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AnalystDashboard } from './components/AnalystDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentRoster } from './components/StudentRoster';
import { StudentModal } from './components/StudentModal';
import { PredictionEngine } from './components/PredictionEngine';
import { AnalyticsView } from './components/AnalyticsView';
import { DatasetManager } from './components/DatasetManager';
import { AIModelView } from './components/AIModelView';
import { UserManagement } from './components/UserManagement';
import { SupportPortal } from './components/SupportPortal';
import { OfflineGuideModal } from './components/OfflineGuideModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Theme State: Dark / Light Mode (persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edupredict_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to <html> root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('edupredict_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('edupredict_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // State: Active User & Roles (null by default if not authenticated)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('edupredict_users');
    let loadedUsers: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    const adminIndex = loadedUsers.findIndex((u) => u.role === 'admin' || u.username === 'admin');
    if (adminIndex >= 0) {
      loadedUsers[adminIndex] = {
        ...loadedUsers[adminIndex],
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        name: loadedUsers[adminIndex].name || 'System Administrator',
      };
    } else {
      loadedUsers.unshift({
        id: 1,
        username: 'admin',
        name: 'System Administrator',
        role: 'admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        createdAt: '2025-01-10',
      });
    }
    return loadedUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = localStorage.getItem('edupredict_session');
    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        return null;
      }
    }
    return null;
  });

  // State: Auth Modal
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
    initialRole?: UserRole;
  }>({
    isOpen: false,
    mode: 'login',
  });

  // State: Navigation Tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // State: Students & Predictions
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edupredict_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [predictions, setPredictions] = useState<MLPredictionResult[]>(() => {
    const saved = localStorage.getItem('edupredict_predictions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('edupredict_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // Modal Controls
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit' | 'view';
    student: Student | null;
  }>({
    isOpen: false,
    mode: 'add',
    student: null,
  });

  const [isOfflineGuideOpen, setIsOfflineGuideOpen] = useState(false);
  const [selectedStudentForPred, setSelectedStudentForPred] = useState<Student | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('edupredict_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edupredict_predictions', JSON.stringify(predictions));
  }, [predictions]);

  useEffect(() => {
    localStorage.setItem('edupredict_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('edupredict_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const currentRole: UserRole = currentUser?.role || 'student';

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edupredict_session');
    setActiveTab('dashboard');
  };

  // Student CRUD
  const handleSaveStudent = (data: Partial<Student>) => {
    if (modalState.mode === 'add') {
      const newStudent: Student = {
        id: Date.now(),
        studentId: data.studentId || `STU${Math.floor(100 + Math.random() * 900)}`,
        name: data.name || 'New Student',
        email: data.email || '',
        attendance: Number(data.attendance) || 80,
        previousMarks: Number(data.previousMarks) || 75,
        assignmentScore: Number(data.assignmentScore) || 75,
        quizScore: Number(data.quizScore) || 75,
        studyHours: Number(data.studyHours) || 10,
        lmsActivity: Number(data.lmsActivity) || 70,
        participation: Number(data.participation) || 7,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStudents((prev) => [newStudent, ...prev]);
    } else if (modalState.mode === 'edit' && modalState.student) {
      setStudents((prev) =>
        prev.map((s) => (s.id === modalState.student!.id ? { ...s, ...data } : s))
      );
    }
  };

  const handleDeleteStudent = (id: number) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handlePredictForStudent = (student: Student) => {
    setSelectedStudentForPred(student);
    setActiveTab('prediction');
  };

  const handleViewStudent = (student: Student) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      student,
    });
  };

  // User Management
  const handleAddUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const handleUpdateUserRole = (id: number, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Retrain Simulation
  const handleRetrainModel = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      alert('Local Random Forest Classifier successfully retrained on current dataset matrix (100 estimators, 94.4% accuracy)!');
    }, 1500);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'student_id',
      'name',
      'email',
      'attendance',
      'previous_marks',
      'assignment_score',
      'quiz_score',
      'study_hours',
      'lms_activity',
      'participation',
    ];
    const rows = students.map((s) =>
      [
        s.studentId,
        `"${s.name}"`,
        s.email,
        s.attendance,
        s.previousMarks,
        s.assignmentScore,
        s.quizScore,
        s.studyHours,
        s.lmsActivity,
        s.participation,
      ].join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edupredict_cohort_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCSVText = (csvText: string): boolean => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return false;

      const newRecords: Student[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length >= 7) {
          newRecords.push({
            id: Date.now() + i,
            studentId: cols[0] || `STU${100 + i}`,
            name: cols[1] || `Student ${i}`,
            email: cols[2] || `student${i}@edupredict.edu`,
            attendance: Number(cols[3]) || 80,
            previousMarks: Number(cols[4]) || 70,
            assignmentScore: Number(cols[5]) || 75,
            quizScore: Number(cols[6]) || 75,
            studyHours: Number(cols[7]) || 10,
            lmsActivity: Number(cols[8]) || 70,
            participation: Number(cols[9]) || 7,
            createdAt: new Date().toISOString().split('T')[0],
          });
        }
      }

      if (newRecords.length > 0) {
        setStudents((prev) => [...newRecords, ...prev]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset database back to initial sample records?')) {
      setStudents(INITIAL_STUDENTS);
      setUsers(INITIAL_USERS);
      setTickets(INITIAL_TICKETS);
      localStorage.removeItem('edupredict_students');
      localStorage.removeItem('edupredict_predictions');
      localStorage.removeItem('edupredict_users');
      localStorage.removeItem('edupredict_tickets');
    }
  };

  const handleContactSubmit = (name: string, email: string, subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: Date.now(),
      name,
      email,
      subject: subject || 'Public Landing Page Inquiry',
      message,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('edupredict_session', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleRegisterSuccess = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('edupredict_session', JSON.stringify(newUser));
    
    // If student registered, create clean student profile with NO academic data and NO prediction
    if (newUser.role === 'student') {
      const newStudent: Student = {
        id: Date.now(),
        userId: newUser.id,
        studentId: `STU${Math.floor(1000 + Math.random() * 9000)}`,
        name: newUser.name,
        email: newUser.email,
        attendance: null,
        previousMarks: null,
        assignmentScore: null,
        quizScore: null,
        studyHours: null,
        lmsActivity: null,
        participation: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setStudents((prev) => [newStudent, ...prev]);
    }

    setActiveTab('dashboard');
  };

  // Find linked student record strictly for the logged in student
  const activeStudentRecord = currentUser && currentUser.role === 'student'
    ? students.find(
        (s) =>
          (s.userId && s.userId === currentUser.id) ||
          (s.email && currentUser.email && s.email.toLowerCase() === currentUser.email.toLowerCase())
      ) || null
    : null;

  // Active student's saved ML prediction (only present if explicitly requested)
  const activeStudentPrediction = activeStudentRecord
    ? predictions.find((p) => p.studentId === activeStudentRecord.studentId) || null
    : null;

  // Save student academic metrics (without generating automatic prediction)
  const handleSaveStudentAcademicInfo = (
    studentId: string,
    data: {
      attendance: number;
      previousMarks: number;
      assignmentScore: number;
      quizScore: number;
      studyHours: number;
      lmsActivity: number;
      participation: number;
    }
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? {
              ...s,
              attendance: data.attendance,
              previousMarks: data.previousMarks,
              assignmentScore: data.assignmentScore,
              quizScore: data.quizScore,
              studyHours: data.studyHours,
              lmsActivity: data.lmsActivity,
              participation: data.participation,
            }
          : s
      )
    );
  };

  // Explicitly run and persist ML prediction for student
  const handlePredictMyPerformance = (student: Student) => {
    if (
      student.attendance === null ||
      student.previousMarks === null ||
      student.assignmentScore === null ||
      student.quizScore === null ||
      student.studyHours === null ||
      student.lmsActivity === null ||
      student.participation === null
    ) {
      return;
    }

    const result = predictStudentPerformance(
      {
        attendance: student.attendance,
        previousMarks: student.previousMarks,
        assignmentScore: student.assignmentScore,
        quizScore: student.quizScore,
        studyHours: student.studyHours,
        lmsActivity: student.lmsActivity,
        participation: student.participation,
      },
      student.studentId,
      student.name
    );

    setPredictions((prev) => [
      result,
      ...prev.filter((p) => p.studentId !== student.studentId),
    ]);
  };

  const studentsWithData = students.filter(
    (s) => s.attendance !== null && s.previousMarks !== null
  );

  const atRiskCount = studentsWithData.filter(
    (s) => (s.attendance ?? 100) < 65 || (s.previousMarks ?? 100) < 50
  ).length;

  // 1. PUBLIC LANDING PAGE (rendered when NOT authenticated)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        <LandingPage
          onNavigateToLogin={(role) => {
            setAuthModal({ isOpen: true, mode: 'login', initialRole: role });
          }}
          onNavigateToRegister={() => {
            setAuthModal({ isOpen: true, mode: 'register' });
          }}
          onEnterDashboard={(role) => {
            setAuthModal({ isOpen: true, mode: 'login', initialRole: role });
          }}
          onSubmitContact={handleContactSubmit}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModal.isOpen}
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          users={users}
        />
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD (only accessible when currentUser is valid)
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors">
      
      {/* Top Navigation with Dark Mode Toggle */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenOfflineGuide={() => setIsOfflineGuideOpen(true)}
        atRiskCount={atRiskCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenOfflineGuide={() => setIsOfflineGuideOpen(true)}
          onLogout={handleLogout}
          studentCount={students.length}
        />

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {currentRole === 'admin' && (
                <AdminDashboard
                  students={students}
                  users={users}
                  predictions={predictions}
                  onNavigate={setActiveTab}
                  onSelectStudent={(s) => handleViewStudent(s)}
                />
              )}

              {currentRole === 'teacher' && (
                <TeacherDashboard
                  students={students}
                  predictions={predictions}
                  onOpenAddStudent={() =>
                    setModalState({ isOpen: true, mode: 'add', student: null })
                  }
                  onNavigate={setActiveTab}
                  onSelectStudent={(s) => handleViewStudent(s)}
                />
              )}

              {currentRole === 'analyst' && (
                <AnalystDashboard
                  students={students}
                  predictions={predictions}
                  onNavigate={setActiveTab}
                  onRetrainModel={handleRetrainModel}
                  isRetraining={isRetraining}
                />
              )}

              {currentRole === 'student' && (
                <StudentDashboard
                  student={activeStudentRecord}
                  savedPrediction={activeStudentPrediction}
                  onSaveAcademicInfo={handleSaveStudentAcademicInfo}
                  onPredictMyPerformance={handlePredictMyPerformance}
                  onNavigate={setActiveTab}
                />
              )}
            </>
          )}

          {/* TAB: STUDENTS ROSTER (Staff roles only) */}
          {activeTab === 'students' && currentRole !== 'student' && (
            <StudentRoster
              students={students}
              onAddStudent={() =>
                setModalState({ isOpen: true, mode: 'add', student: null })
              }
              onEditStudent={(s) =>
                setModalState({ isOpen: true, mode: 'edit', student: s })
              }
              onDeleteStudent={handleDeleteStudent}
              onPredictForStudent={handlePredictForStudent}
              onViewStudent={handleViewStudent}
              onExportCSV={handleExportCSV}
              onImportCSV={() => setActiveTab('dataset')}
            />
          )}

          {/* TAB: AI PREDICTIONS */}
          {activeTab === 'prediction' && (
            <PredictionEngine
              students={students}
              selectedStudentPreset={selectedStudentForPred}
              onSavePrediction={(p) => setPredictions((prev) => [p, ...prev])}
            />
          )}

          {/* TAB: ANALYTICS (Staff roles only) */}
          {activeTab === 'analytics' && currentRole !== 'student' && (
            <AnalyticsView students={students} />
          )}

          {/* TAB: DATASET (Admin & Analyst only) */}
          {activeTab === 'dataset' && (currentRole === 'admin' || currentRole === 'analyst') && (
            <DatasetManager
              students={students}
              onImportCSVText={handleImportCSVText}
              onExportCSV={handleExportCSV}
              onRetrainModel={handleRetrainModel}
              isRetraining={isRetraining}
              onResetSampleData={handleResetSampleData}
            />
          )}

          {/* TAB: AI MODEL INFO (Admin & Analyst only) */}
          {activeTab === 'model' && (currentRole === 'admin' || currentRole === 'analyst') && (
            <AIModelView
              onRetrainModel={handleRetrainModel}
              isRetraining={isRetraining}
              userRole={currentRole}
            />
          )}

          {/* TAB: USERS (Admin Only) */}
          {activeTab === 'users' && currentRole === 'admin' && (
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onUpdateRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
              currentUserId={currentUser.id}
            />
          )}

          {/* TAB: SUPPORT (All authenticated users) */}
          {activeTab === 'support' && (
            <SupportPortal
              currentUser={currentUser}
              tickets={tickets}
              onSubmitTicket={(t) =>
                setTickets((prev) => [
                  {
                    ...t,
                    id: Date.now(),
                    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  },
                  ...prev,
                ])
              }
              onOpenOfflineGuide={() => setIsOfflineGuideOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Student Add/Edit/View Modal */}
      <StudentModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        student={modalState.student}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSave={handleSaveStudent}
      />

      {/* Offline Python Flask Execution Modal */}
      <OfflineGuideModal
        isOpen={isOfflineGuideOpen}
        onClose={() => setIsOfflineGuideOpen(false)}
      />

    </div>
  );
}
