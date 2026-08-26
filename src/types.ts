export type UserRole = 'admin' | 'teacher' | 'analyst' | 'student';

export interface User {
  id: number;
  username: string;
  role: UserRole;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export interface Student {
  id: number;
  userId?: number;
  studentId: string;
  name: string;
  email: string;
  attendance: number | null;       // 0 - 100 or null if not provided
  previousMarks: number | null;    // 0 - 100 or null if not provided
  assignmentScore: number | null;  // 0 - 100 or null if not provided
  quizScore: number | null;        // 0 - 100 or null if not provided
  studyHours: number | null;       // weekly hours or null if not provided
  lmsActivity: number | null;      // 0 - 100 or null if not provided
  participation: number | null;    // 1 - 10 or null if not provided
  createdAt: string;
}

export type PerformanceClass = 'Excellent' | 'Good' | 'Average' | 'At Risk';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface MLPredictionResult {
  id?: string;
  studentId?: string;
  studentName?: string;
  performance: PerformanceClass;
  riskLevel: RiskLevel;
  confidence: number;
  scoreIndex: number;
  probabilities: {
    Excellent: number;
    Good: number;
    Average: number;
    'At Risk': number;
  };
  keyDrivers: {
    feature: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
  explanation: string;
  timestamp: string;
}

export interface SupportTicket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}
