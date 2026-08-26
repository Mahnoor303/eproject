/**
 * EduPredict — Client-side Dashboard & Analytics Scripts
 * 100% Offline Compatible (No CDN or external dependencies required)
 */

document.addEventListener("DOMContentLoaded", function () {
  // 1. Quick Fill Demo Login Credentials
  const quickFillBtns = document.querySelectorAll(".quick-fill-btn");
  quickFillBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const u = this.getAttribute("data-username");
      const p = this.getAttribute("data-password");
      const userField = document.getElementById("username");
      const passField = document.getElementById("password");
      if (userField && passField) {
        userField.value = u;
        passField.value = p;
      }
    });
  });

  // 2. Student Selection Auto-Fill on Prediction Form
  const studentSelect = document.getElementById("student_select");
  if (studentSelect) {
    studentSelect.addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      if (selectedOption && selectedOption.value) {
        const att = selectedOption.getAttribute("data-attendance");
        const prev = selectedOption.getAttribute("data-previous");
        const assign = selectedOption.getAttribute("data-assignment");
        const quiz = selectedOption.getAttribute("data-quiz");
        const study = selectedOption.getAttribute("data-study");
        const lms = selectedOption.getAttribute("data-lms");
        const part = selectedOption.getAttribute("data-participation");
        const name = selectedOption.getAttribute("data-name");

        if (document.getElementById("student_id_input")) document.getElementById("student_id_input").value = selectedOption.value;
        if (document.getElementById("student_name_input")) document.getElementById("student_name_input").value = name || "";
        if (document.getElementById("attendance")) document.getElementById("attendance").value = att || 75;
        if (document.getElementById("previous_marks")) document.getElementById("previous_marks").value = prev || 70;
        if (document.getElementById("assignment_score")) document.getElementById("assignment_score").value = assign || 75;
        if (document.getElementById("quiz_score")) document.getElementById("quiz_score").value = quiz || 70;
        if (document.getElementById("study_hours")) document.getElementById("study_hours").value = study || 10;
        if (document.getElementById("lms_activity")) document.getElementById("lms_activity").value = lms || 65;
        if (document.getElementById("participation")) document.getElementById("participation").value = part || 7;

        // Trigger input event to update range displays
        document.querySelectorAll("input[type=range]").forEach(r => r.dispatchEvent(new Event("input")));
      }
    });
  }

  // 3. Live Range Slider Value Display Updates
  const rangeInputs = document.querySelectorAll(".range-with-display");
  rangeInputs.forEach(range => {
    const displayId = range.getAttribute("data-display-id");
    const displayEl = document.getElementById(displayId);
    if (displayEl) {
      const updateVal = () => {
        const unit = range.getAttribute("data-unit") || "";
        displayEl.textContent = range.value + unit;
      };
      range.addEventListener("input", updateVal);
      updateVal();
    }
  });

  // 4. Live Table Search Filter
  const tableSearch = document.getElementById("tableSearchInput");
  if (tableSearch) {
    tableSearch.addEventListener("keyup", function () {
      const query = this.value.toLowerCase();
      const rows = document.querySelectorAll(".searchable-table tbody tr");
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "" : "none";
      });
    });
  }

  // 5. Flash Alerts auto-dismiss
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transition = "opacity 0.4s ease";
      setTimeout(() => alert.remove(), 400);
    }, 6000);
  });
});
