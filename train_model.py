"""
EduPredict — Machine Learning Model Training Pipeline
AI-Based Student Performance & Educational Analytics System

This pipeline trains a scikit-learn RandomForestClassifier on local educational data
and exports the trained model, feature order, and evaluation metrics for offline inference.

Libraries:
- pandas
- numpy
- scikit-learn
- joblib
"""

import os
import sys
import json
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
import joblib

# Paths setup
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODELS_DIR = os.path.join(BASE_DIR, "models")
CSV_PATH = os.path.join(DATA_DIR, "sample_students.csv")
MODEL_PATH = os.path.join(MODELS_DIR, "student_performance_model.pkl")
FEATURES_PATH = os.path.join(MODELS_DIR, "model_features.json")
METRICS_PATH = os.path.join(MODELS_DIR, "model_metrics.json")

# Mandatory Feature Order for Model Training and Flask Inference
FEATURE_NAMES = [
    "attendance",
    "previous_marks",
    "assignment_score",
    "quiz_score",
    "study_hours",
    "lms_activity",
    "participation"
]

TARGET_CLASSES = ["At Risk", "Average", "Good", "Excellent"]


def generate_realistic_dataset(n_samples=380, random_state=42):
    """
    Generates a realistic educational dataset with at least 300 records
    exhibiting non-random, logical correlations between study habits,
    attendance, prior scores, and overall student performance category.
    """
    np.random.seed(random_state)

    first_names = [
        "Alexander", "Sophia", "Marcus", "Emma", "Liam", "Aaliyah", "Ethan", "Olivia",
        "Daniel", "Chloe", "Lucas", "Ava", "Noah", "Isabella", "James", "Mia", "Benjamin",
        "Charlotte", "Henry", "Amelia", "Sebastian", "Harper", "Jack", "Evelyn", "Owen",
        "Abigail", "Samuel", "Emily", "David", "Elizabeth", "Joseph", "Sofia", "John",
        "Avery", "Wyatt", "Ella", "Matthew", "Scarlett", "Luke", "Grace", "Asher", "Chloe",
        "Carter", "Victoria", "Julian", "Riley", "Grayson", "Aria", "Leo", "Lily", "Jayden",
        "Aubrey", "Gabriel", "Zoey", "Isaac", "Penelope", "Anthony", "Lillian", "Jaxon", "Addison"
    ]
    last_names = [
        "Hayes", "Martinez", "Vance", "Watson", "O'Connor", "Khan", "Zhang", "Bennett",
        "Rivera", "Dubois", "Silva", "Patel", "Campbell", "Rossi", "Wilson", "Tanaka",
        "Kim", "Muller", "Novak", "Chen", "Gupta", "Santos", "Schmidt", "Anderson",
        "Taylor", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia",
        "Clark", "Robinson", "Lewis", "Walker", "Perez", "Hall", "Young", "Allen", "Sanchez"
    ]

    records = []
    
    # We create a blend of high achievers, solid performers, average students, and at-risk students
    # with strong logical domain relationships
    for i in range(n_samples):
        stu_id = f"STU{1001 + i}"
        fn = np.random.choice(first_names)
        ln = np.random.choice(last_names)
        full_name = f"{fn} {ln}"
        email = f"{fn.lower()}.{ln.lower()}{i+1}@edupredict.edu"

        # Determine underlying latent academic aptitude / engagement level (0.0 to 1.0)
        aptitude = np.random.beta(a=3.2, b=2.2)

        # 1. Attendance (0 - 100%)
        # Attendance correlates strongly with latent engagement
        att_base = aptitude * 65 + 35 + np.random.normal(0, 7)
        attendance = float(np.clip(att_base, 20.0, 100.0).round(1))

        # 2. Previous Marks (0 - 100)
        pm_base = aptitude * 60 + 38 + np.random.normal(0, 8)
        previous_marks = float(np.clip(pm_base, 25.0, 99.0).round(1))

        # 3. Study Hours (1 - 38 hrs/week)
        sh_base = (aptitude * 18 + 4) + (attendance / 100.0 * 6) + np.random.normal(0, 2.5)
        study_hours = float(np.clip(sh_base, 1.0, 38.0).round(1))

        # 4. Assignment Score (0 - 100)
        as_base = (previous_marks * 0.45) + (attendance * 0.35) + (study_hours * 0.8) + np.random.normal(5, 6)
        assignment_score = float(np.clip(as_base, 20.0, 100.0).round(1))

        # 5. Quiz Score (0 - 100)
        qs_base = (previous_marks * 0.55) + (study_hours * 1.3) + (attendance * 0.15) + np.random.normal(4, 6)
        quiz_score = float(np.clip(qs_base, 20.0, 100.0).round(1))

        # 6. LMS Activity (0 - 100 index)
        lms_base = (attendance * 0.45) + (study_hours * 1.8) + (aptitude * 25) + np.random.normal(5, 7)
        lms_activity = float(np.clip(lms_base, 10.0, 100.0).round(1))

        # 7. Participation (1 - 10 scale)
        part_base = (attendance / 10.0 * 0.55) + (study_hours / 4.0 * 0.25) + (aptitude * 2.5) + np.random.normal(0, 0.7)
        participation = float(np.clip(part_base, 1.0, 10.0).round(1))

        # Composite score calculation for ground truth educational labeling
        composite = (
            attendance * 0.20 +
            previous_marks * 0.25 +
            assignment_score * 0.15 +
            quiz_score * 0.15 +
            (study_hours / 35.0 * 100.0) * 0.10 +
            lms_activity * 0.10 +
            (participation / 10.0 * 100.0) * 0.05
        )

        # Realistic categorical thresholding with domain rules (e.g. low attendance triggers At Risk)
        if composite < 53.0 or attendance < 60.0 or (previous_marks < 48.0 and assignment_score < 50.0):
            perf = "At Risk"
        elif composite < 71.0:
            perf = "Average"
        elif composite < 85.5:
            perf = "Good"
        else:
            perf = "Excellent"

        records.append({
            "student_id": stu_id,
            "name": full_name,
            "email": email,
            "attendance": attendance,
            "previous_marks": previous_marks,
            "assignment_score": assignment_score,
            "quiz_score": quiz_score,
            "study_hours": study_hours,
            "lms_activity": lms_activity,
            "participation": participation,
            "performance": perf
        })

    df = pd.DataFrame(records)
    return df


def clean_and_prepare_data(df):
    """
    Cleans educational data, ensures proper bounds, handles missing values,
    and formats feature vectors and labels.
    """
    df_clean = df.copy()

    # Handle missing numeric columns with domain-appropriate median imputation
    defaults = {
        "attendance": 75.0,
        "previous_marks": 70.0,
        "assignment_score": 75.0,
        "quiz_score": 70.0,
        "study_hours": 10.0,
        "lms_activity": 65.0,
        "participation": 7.0
    }

    for col in FEATURE_NAMES:
        if col not in df_clean.columns:
            df_clean[col] = defaults[col]
        else:
            df_clean[col] = pd.to_numeric(df_clean[col], errors="coerce")
            df_clean[col] = df_clean[col].fillna(defaults[col])

    # Bound verification
    df_clean["attendance"] = df_clean["attendance"].clip(0.0, 100.0)
    df_clean["previous_marks"] = df_clean["previous_marks"].clip(0.0, 100.0)
    df_clean["assignment_score"] = df_clean["assignment_score"].clip(0.0, 100.0)
    df_clean["quiz_score"] = df_clean["quiz_score"].clip(0.0, 100.0)
    df_clean["study_hours"] = df_clean["study_hours"].clip(0.0, 40.0)
    df_clean["lms_activity"] = df_clean["lms_activity"].clip(0.0, 100.0)
    df_clean["participation"] = df_clean["participation"].clip(1.0, 10.0)

    # Derive performance target if missing
    if "performance" not in df_clean.columns or df_clean["performance"].isnull().all():
        composite = (
            df_clean["attendance"] * 0.20 +
            df_clean["previous_marks"] * 0.25 +
            df_clean["assignment_score"] * 0.15 +
            df_clean["quiz_score"] * 0.15 +
            (df_clean["study_hours"] / 35.0 * 100.0) * 0.10 +
            df_clean["lms_activity"] * 0.10 +
            (df_clean["participation"] / 10.0 * 100.0) * 0.05
        )
        labels = []
        for comp, att in zip(composite, df_clean["attendance"]):
            if comp < 53.0 or att < 60.0:
                labels.append("At Risk")
            elif comp < 71.0:
                labels.append("Average")
            elif comp < 85.5:
                labels.append("Good")
            else:
                labels.append("Excellent")
        df_clean["performance"] = labels

    return df_clean


def train_model(csv_path=CSV_PATH, model_output_path=MODEL_PATH, verbose=True):
    """
    Executes the full Machine Learning training pipeline:
    1. Loads or generates dataset (>= 300 records)
    2. Cleans data & handles missing values
    3. Splits 80/20 train/test
    4. Trains scikit-learn Pipeline with StandardScaler + RandomForestClassifier
    5. Evaluates metrics (Accuracy, Precision, Recall, F1, Confusion Matrix)
    6. Saves model (.pkl), feature order (.json), and metrics (.json)
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(MODELS_DIR, exist_ok=True)

    if verbose:
        print("=" * 65)
        print("  EduPredict — Local Machine Learning Training Pipeline")
        print("=" * 65)

    # Step 1 & 2: Load or create educational dataset
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            if len(df) < 300:
                if verbose:
                    print(f"[*] Dataset '{csv_path}' has only {len(df)} records. Generating full 380-record cohort dataset...")
                df = generate_realistic_dataset(n_samples=380)
                df.to_csv(csv_path, index=False)
            else:
                if verbose:
                    print(f"[*] Loaded educational dataset from '{csv_path}' ({len(df)} records).")
        except Exception as e:
            if verbose:
                print(f"[!] Error reading '{csv_path}': {e}. Generating new dataset...")
            df = generate_realistic_dataset(n_samples=380)
            df.to_csv(csv_path, index=False)
    else:
        if verbose:
            print(f"[*] Dataset '{csv_path}' not found. Generating 380 realistic student records...")
        df = generate_realistic_dataset(n_samples=380)
        df.to_csv(csv_path, index=False)
        if verbose:
            print(f"[+] Dataset created and saved to '{csv_path}'.")

    # Step 3 & 4: Clean & handle missing values
    df_clean = clean_and_prepare_data(df)

    # Step 5 & 6: Select features and target variable
    X = df_clean[FEATURE_NAMES]
    y = df_clean["performance"].astype(str)

    # Step 7: Train/Test Split (80/20 with stratification)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    if verbose:
        print(f"[*] Data split completed: {len(X_train)} training records (80%), {len(X_test)} test records (20%).")

    # Step 8: Train real scikit-learn Pipeline
    # StandardScaler + RandomForestClassifier ensures consistent preprocessing and inference
    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(
            n_estimators=120,
            max_depth=9,
            min_samples_split=4,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ))
    ])

    if verbose:
        print("[*] Training RandomForestClassifier pipeline...")
    pipeline.fit(X_train, y_train)

    # Step 9: Evaluation
    y_pred = pipeline.predict(X_test)
    
    acc = float(accuracy_score(y_test, y_pred))
    prec_weighted = float(precision_score(y_test, y_pred, average="weighted", zero_division=0))
    rec_weighted = float(recall_score(y_test, y_pred, average="weighted", zero_division=0))
    f1_weighted = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))

    # Confusion matrix with fixed class labels
    classes_order = [c for c in TARGET_CLASSES if c in pipeline.classes_]
    # Add any extra classes if present
    for c in pipeline.classes_:
        if c not in classes_order:
            classes_order.append(c)

    cm = confusion_matrix(y_test, y_pred, labels=classes_order)

    # Feature Importances from the RandomForest classifier
    rf_clf = pipeline.named_steps["classifier"]
    raw_importances = rf_clf.feature_importances_
    feat_importance_dict = {
        feat: round(float(imp), 4)
        for feat, imp in sorted(zip(FEATURE_NAMES, raw_importances), key=lambda x: x[1], reverse=True)
    }

    # Step 10: Print evaluation results in terminal
    if verbose:
        print("\n" + "=" * 65)
        print("  MODEL EVALUATION RESULTS (Test Set)")
        print("=" * 65)
        print(f"  • Overall Accuracy : {acc * 100.0:.2f}%")
        print(f"  • Precision (Wgt)  : {prec_weighted * 100.0:.2f}%")
        print(f"  • Recall (Wgt)     : {rec_weighted * 100.0:.2f}%")
        print(f"  • F1 Score (Wgt)   : {f1_weighted * 100.0:.2f}%")
        print("-" * 65)
        print("  Classification Report:")
        print(classification_report(y_test, y_pred, zero_division=0))
        print("  Confusion Matrix:")
        print(f"  Labels: {classes_order}")
        for row in cm:
            print("  " + str(row.tolist()))
        print("-" * 65)
        print("  Feature Importances:")
        for f_name, imp_val in feat_importance_dict.items():
            print(f"    - {f_name:<20}: {imp_val * 100.0:.1f}%")
        print("=" * 65)

    # Step 11: Save trained model using joblib.dump()
    model_payload = {
        "pipeline": pipeline,
        "model": pipeline,
        "feature_names": FEATURE_NAMES,
        "classes": list(pipeline.classes_),
        "accuracy": acc,
        "precision": prec_weighted,
        "recall": rec_weighted,
        "f1_score": f1_weighted,
        "model_type": "RandomForestClassifier",
        "trained_at": datetime.utcnow().isoformat()
    }
    joblib.dump(model_payload, model_output_path)
    if verbose:
        print(f"[+] Trained model saved to '{model_output_path}'")

    # Step 12: Save feature names/order to models/model_features.json
    feature_meta = {
        "feature_names": FEATURE_NAMES,
        "feature_count": len(FEATURE_NAMES),
        "target_classes": TARGET_CLASSES,
        "description": "Order of educational features required by the RandomForest inference pipeline."
    }
    with open(FEATURES_PATH, "w", encoding="utf-8") as f:
        json.dump(feature_meta, f, indent=2)
    if verbose:
        print(f"[+] Feature metadata saved to '{FEATURES_PATH}'")

    # Step 13: Save comprehensive model metrics to models/model_metrics.json
    metrics_summary = {
        "model_type": "Random Forest Classifier",
        "algorithm": "scikit-learn Pipeline (StandardScaler + RandomForestClassifier)",
        "n_estimators": 120,
        "max_depth": 9,
        "train_records": int(len(X_train)),
        "test_records": int(len(X_test)),
        "total_records": int(len(df_clean)),
        "accuracy": round(acc * 100.0, 2),
        "precision": round(prec_weighted * 100.0, 2),
        "recall": round(rec_weighted * 100.0, 2),
        "f1_score": round(f1_weighted * 100.0, 2),
        "classes": list(pipeline.classes_),
        "confusion_matrix": cm.tolist(),
        "feature_importances": feat_importance_dict,
        "features": [
            {"name": "Attendance", "key": "attendance", "importance": feat_importance_dict.get("attendance", 0), "range": "0 - 100%"},
            {"name": "Previous Marks", "key": "previous_marks", "importance": feat_importance_dict.get("previous_marks", 0), "range": "0 - 100"},
            {"name": "Assignment Score", "key": "assignment_score", "importance": feat_importance_dict.get("assignment_score", 0), "range": "0 - 100"},
            {"name": "Quiz Score", "key": "quiz_score", "importance": feat_importance_dict.get("quiz_score", 0), "range": "0 - 100"},
            {"name": "Study Hours", "key": "study_hours", "importance": feat_importance_dict.get("study_hours", 0), "range": "0 - 40 hrs/wk"},
            {"name": "LMS Activity", "key": "lms_activity", "importance": feat_importance_dict.get("lms_activity", 0), "range": "0 - 100"},
            {"name": "Participation", "key": "participation", "importance": feat_importance_dict.get("participation", 0), "range": "1 - 10"}
        ],
        "trained_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "dataset_source": "data/sample_students.csv"
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)
    if verbose:
        print(f"[+] Model metrics summary saved to '{METRICS_PATH}'\n")

    return metrics_summary


if __name__ == "__main__":
    train_model(verbose=True)
