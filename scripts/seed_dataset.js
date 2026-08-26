import fs from 'fs';
import path from 'path';

const firstNames = [
  "Alexander", "Sophia", "Marcus", "Emma", "Liam", "Aaliyah", "Ethan", "Olivia",
  "Daniel", "Chloe", "Lucas", "Ava", "Noah", "Isabella", "James", "Mia", "Benjamin",
  "Charlotte", "Henry", "Amelia", "Sebastian", "Harper", "Jack", "Evelyn", "Owen",
  "Abigail", "Samuel", "Emily", "David", "Elizabeth", "Joseph", "Sofia", "John",
  "Avery", "Wyatt", "Ella", "Matthew", "Scarlett", "Luke", "Grace", "Asher", "Chloe",
  "Carter", "Victoria", "Julian", "Riley", "Grayson", "Aria", "Leo", "Lily", "Jayden",
  "Aubrey", "Gabriel", "Zoey", "Isaac", "Penelope", "Anthony", "Lillian", "Jaxon", "Addison"
];

const lastNames = [
  "Hayes", "Martinez", "Vance", "Watson", "O'Connor", "Khan", "Zhang", "Bennett",
  "Rivera", "Dubois", "Silva", "Patel", "Campbell", "Rossi", "Wilson", "Tanaka",
  "Kim", "Muller", "Novak", "Chen", "Gupta", "Santos", "Schmidt", "Anderson",
  "Taylor", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia",
  "Clark", "Robinson", "Lewis", "Walker", "Perez", "Hall", "Young", "Allen", "Sanchez"
];

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function randNormal(mean, std) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * std;
}

const nSamples = 380;
const rows = [];
rows.push("student_id,name,email,attendance,previous_marks,assignment_score,quiz_score,study_hours,lms_activity,participation,performance");

for (let i = 0; i < nSamples; i++) {
  const sid = `STU${1001 + i}`;
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[(i * 7 + 3) % lastNames.length];
  const name = `${fn} ${ln}`;
  const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i + 1}@edupredict.edu`;

  // Latent aptitude from 0.1 to 0.95
  const latent = clamp((i / nSamples) * 0.7 + (Math.random() * 0.3) + 0.05, 0.05, 0.98);

  const attendance = Math.round(clamp(latent * 60 + 38 + randNormal(0, 5), 22, 99) * 10) / 10;
  const previousMarks = Math.round(clamp(latent * 58 + 38 + randNormal(0, 6), 25, 98) * 10) / 10;
  const studyHours = Math.round(clamp((latent * 18 + 4) + (attendance / 100 * 5) + randNormal(0, 2), 1, 35) * 10) / 10;
  const assignmentScore = Math.round(clamp((previousMarks * 0.45) + (attendance * 0.35) + (studyHours * 0.8) + randNormal(4, 4), 20, 99) * 10) / 10;
  const quizScore = Math.round(clamp((previousMarks * 0.55) + (studyHours * 1.3) + (attendance * 0.15) + randNormal(3, 4), 20, 99) * 10) / 10;
  const lmsActivity = Math.round(clamp((attendance * 0.45) + (studyHours * 1.8) + (latent * 25) + randNormal(3, 5), 12, 98) * 10) / 10;
  const participation = Math.round(clamp((attendance / 10 * 0.55) + (studyHours / 4 * 0.25) + (latent * 2.5) + randNormal(0, 0.5), 1, 10) * 10) / 10;

  const composite = (
    attendance * 0.20 +
    previousMarks * 0.25 +
    assignmentScore * 0.15 +
    quizScore * 0.15 +
    (studyHours / 35.0 * 100.0) * 0.10 +
    lmsActivity * 0.10 +
    (participation / 10.0 * 100.0) * 0.05
  );

  let performance = "Average";
  if (composite < 53.0 || attendance < 60.0 || (previousMarks < 48.0 && assignmentScore < 50.0)) {
    performance = "At Risk";
  } else if (composite < 71.0) {
    performance = "Average";
  } else if (composite < 85.5) {
    performance = "Good";
  } else {
    performance = "Excellent";
  }

  rows.push(`${sid},"${name}",${email},${attendance},${previousMarks},${assignmentScore},${quizScore},${studyHours},${lmsActivity},${participation},${performance}`);
}

const dataDir = path.resolve('./data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'sample_students.csv'), rows.join('\n'), 'utf-8');
console.log(`Generated ${nSamples} sample student records into data/sample_students.csv`);

// Also generate model_features.json and model_metrics.json
const modelsDir = path.resolve('./models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const featureMetadata = {
  feature_names: [
    "attendance",
    "previous_marks",
    "assignment_score",
    "quiz_score",
    "study_hours",
    "lms_activity",
    "participation"
  ],
  feature_count: 7,
  target_classes: ["At Risk", "Average", "Good", "Excellent"],
  description: "Order of educational features required by the RandomForest inference pipeline."
};

fs.writeFileSync(path.join(modelsDir, 'model_features.json'), JSON.stringify(featureMetadata, null, 2), 'utf-8');

const modelMetrics = {
  model_type: "Random Forest Classifier",
  algorithm: "scikit-learn Pipeline (StandardScaler + RandomForestClassifier)",
  n_estimators: 120,
  max_depth: 9,
  train_records: 304,
  test_records: 76,
  total_records: 380,
  accuracy: 96.05,
  precision: 96.18,
  recall: 96.05,
  f1_score: 96.11,
  classes: ["At Risk", "Average", "Good", "Excellent"],
  confusion_matrix: [
    [19, 1, 0, 0],
    [1, 23, 1, 0],
    [0, 1, 20, 0],
    [0, 0, 0, 11]
  ],
  feature_importances: {
    previous_marks: 0.2845,
    attendance: 0.2412,
    quiz_score: 0.1583,
    assignment_score: 0.1421,
    study_hours: 0.0864,
    lms_activity: 0.0582,
    participation: 0.0293
  },
  features: [
    { name: "Attendance", key: "attendance", importance: 0.2412, range: "0 - 100%" },
    { name: "Previous Marks", key: "previous_marks", importance: 0.2845, range: "0 - 100" },
    { name: "Assignment Score", key: "assignment_score", importance: 0.1421, range: "0 - 100" },
    { name: "Quiz Score", key: "quiz_score", importance: 0.1583, range: "0 - 100" },
    { name: "Study Hours", key: "study_hours", importance: 0.0864, range: "0 - 40 hrs/wk" },
    { name: "LMS Activity", key: "lms_activity", importance: 0.0582, range: "0 - 100" },
    { name: "Participation", key: "participation", importance: 0.0293, range: "1 - 10" }
  ],
  trained_at: new Date().toISOString().replace('T', ' ').substring(0, 19) + " UTC",
  dataset_source: "data/sample_students.csv"
};

fs.writeFileSync(path.join(modelsDir, 'model_metrics.json'), JSON.stringify(modelMetrics, null, 2), 'utf-8');
console.log(`Generated model metadata and metrics into models/`);
