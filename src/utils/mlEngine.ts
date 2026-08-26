import { MLPredictionResult, PerformanceClass, RiskLevel } from '../types';

export interface MLFeatures {
  attendance: number;       // 0-100
  previousMarks: number;    // 0-100
  assignmentScore: number;  // 0-100
  quizScore: number;        // 0-100
  studyHours: number;       // 0-40+
  lmsActivity: number;      // 0-100
  participation: number;    // 1-10
}

/**
 * Executes the Machine Learning Inference Engine simulating Random Forest
 * with feature weights, multi-class decision trees, and XAI explainability.
 */
export function predictStudentPerformance(
  features: MLFeatures,
  studentId?: string,
  studentName?: string
): MLPredictionResult {
  const {
    attendance,
    previousMarks,
    assignmentScore,
    quizScore,
    studyHours,
    lmsActivity,
    participation,
  } = features;

  // Normalized study hours contribution (capped at 35 hrs/wk = 100%)
  const studyNorm = Math.min(100, (studyHours / 30) * 100);
  const partNorm = Math.min(100, (participation / 10) * 100);

  // Composite Weighted Score Calculation (Matching train_model.py RF features)
  // Weights: Previous Exam (25%), Attendance (20%), Assignments (15%), Quizzes (15%), Study (10%), LMS (10%), Participation (5%)
  const scoreIndex = Math.min(
    100,
    Math.max(
      0,
      attendance * 0.20 +
      previousMarks * 0.25 +
      assignmentScore * 0.15 +
      quizScore * 0.15 +
      studyNorm * 0.10 +
      lmsActivity * 0.10 +
      partNorm * 0.05
    )
  );

  let performance: PerformanceClass = 'Average';
  let riskLevel: RiskLevel = 'Medium';

  // Multi-tier Decision Boundaries
  if (scoreIndex >= 84 && attendance >= 78 && previousMarks >= 75) {
    performance = 'Excellent';
    riskLevel = 'Low';
  } else if (scoreIndex >= 70 && attendance >= 68 && previousMarks >= 58) {
    performance = 'Good';
    riskLevel = 'Low';
  } else if (scoreIndex >= 53 && attendance >= 60) {
    performance = 'Average';
    riskLevel = 'Medium';
  } else {
    performance = 'At Risk';
    riskLevel = 'High';
  }

  // Attendance critical safeguard override
  if (attendance < 60) {
    performance = 'At Risk';
    riskLevel = 'High';
  } else if (attendance < 70 && performance === 'Excellent') {
    performance = 'Good';
  }

  // Softmax-like probability distribution estimation
  const dist = computeProbabilities(scoreIndex, attendance);

  // Confidence computation based on peak probability
  const maxProb = Math.max(dist.Excellent, dist.Good, dist.Average, dist['At Risk']);
  const confidence = Math.min(99, Math.max(62, Math.round(maxProb * 100)));

  // Explainability & Key Drivers (XAI / SHAP-style analysis)
  const keyDrivers = [];
  const recommendations: string[] = [];

  // Attendance analysis
  if (attendance >= 85) {
    keyDrivers.push({
      feature: 'Attendance Record',
      impact: 'positive' as const,
      description: `High attendance (${attendance}%) strongly supports academic continuity.`,
    });
  } else if (attendance < 65) {
    keyDrivers.push({
      feature: 'Attendance Deficit',
      impact: 'negative' as const,
      description: `Low attendance (${attendance}%) is the primary risk driver triggering academic warning.`,
    });
    recommendations.push(`Implement attendance tracking intervention; minimum required threshold is 75%.`);
  }

  // Previous Marks analysis
  if (previousMarks >= 80) {
    keyDrivers.push({
      feature: 'Prior Academic Mastery',
      impact: 'positive' as const,
      description: `Solid exam baseline (${previousMarks}%) demonstrates foundational retention.`,
    });
  } else if (previousMarks < 55) {
    keyDrivers.push({
      feature: 'Prior Assessment Struggles',
      impact: 'negative' as const,
      description: `Low midterm score (${previousMarks}%) indicates need for targeted remediation.`,
    });
    recommendations.push(`Assign peer tutor or weekly office hours for core subject revision.`);
  }

  // Study hours
  if (studyHours < 8) {
    keyDrivers.push({
      feature: 'Self-Study Time',
      impact: 'negative' as const,
      description: `Only ${studyHours} hrs/week logged. Recommended threshold is &ge; 12 hrs/week.`,
    });
    recommendations.push(`Schedule daily structured 1.5-hour revision blocks to elevate study time.`);
  } else if (studyHours >= 14) {
    keyDrivers.push({
      feature: 'Dedicated Study Habits',
      impact: 'positive' as const,
      description: `${studyHours} hrs/week of self-directed study provides strong performance lift.`,
    });
  }

  // LMS Activity
  if (lmsActivity < 45) {
    keyDrivers.push({
      feature: 'LMS Disengagement',
      impact: 'negative' as const,
      description: `Portal engagement index of ${lmsActivity}/100 indicates neglected course materials.`,
    });
    recommendations.push(`Check portal notification settings and download weekly supplementary slide decks.`);
  }

  // Quiz / Assignment parity
  if (assignmentScore >= 75 && quizScore < 60) {
    keyDrivers.push({
      feature: 'Exam Anxiety Disparity',
      impact: 'neutral' as const,
      description: `High assignments (${assignmentScore}%) vs lower quizzes (${quizScore}%) indicates test anxiety.`,
    });
    recommendations.push(`Practice timed mock quizzes to improve timed exam execution.`);
  }

  if (recommendations.length === 0) {
    recommendations.push(`Maintain current study momentum and active classroom participation.`);
    recommendations.push(`Explore advanced enrichment modules and honors research topics.`);
  }

  const explanation = generateExplanationText(performance, riskLevel, scoreIndex, attendance, studyHours);

  return {
    id: `pred_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    studentId,
    studentName,
    performance,
    riskLevel,
    confidence,
    scoreIndex: Math.round(scoreIndex * 10) / 10,
    probabilities: {
      Excellent: Math.round(dist.Excellent * 100),
      Good: Math.round(dist.Good * 100),
      Average: Math.round(dist.Average * 100),
      'At Risk': Math.round(dist['At Risk'] * 100),
    },
    keyDrivers,
    recommendations,
    explanation,
    timestamp: new Date().toISOString(),
  };
}

function computeProbabilities(scoreIndex: number, attendance: number) {
  // Center points for each class
  // At Risk: ~40, Average: ~62, Good: ~77, Excellent: ~92
  let s_atRisk = Math.exp(-(Math.pow(scoreIndex - 38, 2)) / 300);
  let s_avg = Math.exp(-(Math.pow(scoreIndex - 62, 2)) / 250);
  let s_good = Math.exp(-(Math.pow(scoreIndex - 78, 2)) / 220);
  let s_excel = Math.exp(-(Math.pow(scoreIndex - 93, 2)) / 200);

  if (attendance < 60) {
    s_atRisk *= 2.5;
    s_excel *= 0.1;
  } else if (scoreIndex > 88 && attendance >= 85) {
    s_excel *= 2.0;
  }

  const sum = s_atRisk + s_avg + s_good + s_excel;
  return {
    'At Risk': s_atRisk / sum,
    Average: s_avg / sum,
    Good: s_good / sum,
    Excellent: s_excel / sum,
  };
}

function generateExplanationText(
  perf: PerformanceClass,
  risk: RiskLevel,
  score: number,
  attendance: number,
  studyHours: number
): string {
  if (perf === 'Excellent') {
    return `Student demonstrates exemplary mastery with a composite index of ${score.toFixed(1)}/100 and strong attendance (${attendance}%). Minimal risk of academic failure; positioned for honors standing.`;
  }
  if (perf === 'Good') {
    return `Consistent academic metrics across assignments and exams (Score Index: ${score.toFixed(1)}/100). Low risk profile with room for enhancement in self-study (${studyHours} hrs/wk).`;
  }
  if (perf === 'Average') {
    return `Moderate academic performance with composite score of ${score.toFixed(1)}/100. Student is meeting standard pass marks but vulnerable to score drops if attendance or assignment rates decline.`;
  }
  return `Critical Risk identified. Composite score (${score.toFixed(1)}/100) or attendance (${attendance}%) is below institutional survival benchmarks. Immediate academic intervention and advisory counseling required.`;
}
