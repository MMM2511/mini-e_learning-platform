// Course Data
const defaultCourses = [
  { id: 1, title: "HTML Basics", description: "Learn HTML structure.", lessons: ["Intro", "Tags", "First Page"], completed: false },
  { id: 2, title: "CSS Styling", description: "Make your pages beautiful.", lessons: ["Selectors", "Flexbox", "Responsive Design"], completed: false },
  { id: 3, title: "JavaScript Essentials", description: "Add logic and interactivity.", lessons: ["Variables", "DOM", "Events"], completed: false }
];

// DOM Elements
const authSection = document.getElementById("auth-section");
const authTitle = document.getElementById("auth-title");
const authBtn = document.getElementById("auth-btn");
const switchAuth = document.getElementById("switch-auth");
const toggleAuth = document.getElementById("toggle-auth");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const courseListSection = document.getElementById("course-list-section");
const courseDetailSection = document.getElementById("course-detail-section");
const courseList = document.getElementById("course-list");
const courseDetail = document.getElementById("course-detail");
const backBtn = document.getElementById("back-btn");
const logoutBtn = document.getElementById("logout-btn");
const currentUserDisplay = document.getElementById("current-user");

let isSignup = false;
let currentUser = null;

// ---------------- AUTH SYSTEM ----------------

// Toggle Login / Signup Mode
switchAuth.addEventListener("click", (e) => {
  e.preventDefault();
  isSignup = !isSignup;
  authTitle.textContent = isSignup ? "Sign Up" : "Login";
  authBtn.textContent = isSignup ? "Create Account" : "Login";
  toggleAuth.innerHTML = isSignup
    ? `Already have an account? <a href="#" id="switch-auth">Login</a>`
    : `Don't have an account? <a href="#" id="switch-auth">Sign Up</a>`;
});

// Handle Auth Button
authBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) return alert("Please fill all fields");

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (isSignup) {
    if (users[username]) return alert("Username already exists!");
    users[username] = { password, courses: JSON.parse(JSON.stringify(defaultCourses)) };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    isSignup = false;
    authTitle.textContent = "Login";
    authBtn.textContent = "Login";
  } else {
    if (!users[username] || users[username].password !== password) return alert("Invalid credentials!");
    currentUser = username;
    localStorage.setItem("currentUser", currentUser);
    loadUserDashboard();
  }
});

// ---------------- DASHBOARD ----------------
function loadUserDashboard() {
  authSection.classList.add("hidden");
  courseListSection.classList.remove("hidden");
  currentUserDisplay.textContent = currentUser;
  loadCourses();
}

function loadCourses() {
  const users = JSON.parse(localStorage.getItem("users"));
  const userCourses = users[currentUser].courses;
  courseList.innerHTML = "";

  userCourses.forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p>Status: <strong>${course.completed ? "✅ Completed" : "⏳ In Progress"}</strong></p>
      <button class="btn" onclick="viewCourse(${course.id})">View Details</button>
    `;
    courseList.appendChild(card);
  });
}

function viewCourse(id) {
  const users = JSON.parse(localStorage.getItem("users"));
  const userCourses = users[currentUser].courses;
  const course = userCourses.find(c => c.id === id);
  courseDetail.innerHTML = `
    <h2>${course.title}</h2>
    <p>${course.description}</p>
    <h4>Lessons:</h4>
    <ul class="lesson-list">
      ${course.lessons.map(lesson => `<li>${lesson}</li>`).join("")}
    </ul>
    <button class="btn" onclick="markCompleted(${course.id})">
      ${course.completed ? "Completed ✅" : "Mark as Completed"}
    </button>
  `;

  courseListSection.classList.add("hidden");
  courseDetailSection.classList.remove("hidden");
}

function markCompleted(id) {
  const users = JSON.parse(localStorage.getItem("users"));
  const userCourses = users[currentUser].courses;
  const course = userCourses.find(c => c.id === id);
  course.completed = true;
  localStorage.setItem("users", JSON.stringify(users));
  alert(`${course.title} marked as completed!`);
  viewCourse(id);
}

backBtn.addEventListener("click", () => {
  courseDetailSection.classList.add("hidden");
  courseListSection.classList.remove("hidden");
  loadCourses();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  currentUser = null;
  authSection.classList.remove("hidden");
  courseListSection.classList.add("hidden");
});

// ---------------- AUTO LOGIN ----------------
window.addEventListener("load", () => {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = savedUser;
    loadUserDashboard();
  }
});

