/**
 * Student Information and Course Management System
 * Web Programming Final Project
 */

// ===== DATA: Courses =====
const courses = [
    {
        code: "WP101",
        name: "Web Programming",
        description: "Learn HTML, CSS, and JavaScript to build interactive websites from scratch.",
        duration: "12 weeks",
        level: "Beginner"
    },
    {
        code: "DB201",
        name: "Database Systems",
        description: "Introduction to relational databases, SQL queries, and data modeling concepts.",
        duration: "10 weeks",
        level: "Intermediate"
    },
    {
        code: "SE301",
        name: "Software Engineering",
        description: "Software development lifecycle, requirements analysis, design patterns, and testing.",
        duration: "14 weeks",
        level: "Intermediate"
    },
    {
        code: "MA401",
        name: "Mobile App Development",
        description: "Build cross-platform mobile applications using modern frameworks and best practices.",
        duration: "12 weeks",
        level: "Advanced"
    },
    {
        code: "CS501",
        name: "Cybersecurity Fundamentals",
        description: "Core concepts of network security, cryptography, threat analysis, and safe coding.",
        duration: "10 weeks",
        level: "Intermediate"
    },
    {
        code: "DS601",
        name: "Data Structures & Algorithms",
        description: "Essential data structures, algorithm design, complexity analysis, and problem solving.",
        duration: "14 weeks",
        level: "Advanced"
    }
];

// ===== DATA: Students =====
let students = [];

function loadStudents() {
    const stored = localStorage.getItem("students");
    if (stored) {
        try {
            students = JSON.parse(stored);
        } catch (e) {
            students = [];
        }
    }
}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// ===== NAVIGATION =====
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove("active");
    }

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add("active");
    }

    const links = document.querySelectorAll(".nav-link");
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute("data-section") === sectionId) {
            links[i].classList.add("active");
        } else {
            links[i].classList.remove("active");
        }
    }

    if (sectionId === "courses") {
        displayCourses(courses);
    }
    if (sectionId === "students") {
        displayStudents(students);
    }
}

// ===== COURSE FUNCTIONS =====
function displayCourses(courseArray) {
    const container = document.getElementById("courseList");
    const noResults = document.getElementById("courseNoResults");
    container.innerHTML = "";

    if (courseArray.length === 0) {
        noResults.style.display = "block";
        return;
    }

    noResults.style.display = "none";

    for (let i = 0; i < courseArray.length; i++) {
        const course = courseArray[i];
        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
            <span class="course-code">${course.code}</span>
            <h3>${course.name}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <strong>Duration:</strong> ${course.duration} &nbsp;|&nbsp;
                <strong>Level:</strong> ${course.level}
            </div>
        `;
        container.appendChild(card);
    }
}

function searchCourses() {
    const query = document.getElementById("courseSearch").value.trim().toLowerCase();

    if (query === "") {
        displayCourses(courses);
        return;
    }

    const results = [];
    for (let i = 0; i < courses.length; i++) {
        const c = courses[i];
        const searchable = (c.name + " " + c.code + " " + c.description + " " + c.level).toLowerCase();
        if (searchable.indexOf(query) !== -1) {
            results.push(c);
        }
    }

    displayCourses(results);
}

// ===== STUDENT FUNCTIONS =====
function displayStudents(studentArray) {
    const tbody = document.getElementById("studentTableBody");
    const noResults = document.getElementById("studentNoResults");
    const countEl = document.getElementById("studentCount");
    tbody.innerHTML = "";

    if (studentArray.length === 0) {
        noResults.style.display = "block";
        countEl.textContent = "Total records: 0";
        return;
    }

    noResults.style.display = "none";

    for (let i = 0; i < studentArray.length; i++) {
        const s = studentArray[i];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.email}</td>
            <td>${s.gender}</td>
            <td>${s.course}</td>
            <td>${s.skills.length > 0 ? s.skills.join(", ") : "—"}</td>
        `;
        tbody.appendChild(row);
    }

    countEl.textContent = "Total records shown: " + studentArray.length;
}

function searchStudents() {
    const query = document.getElementById("studentSearch").value.trim().toLowerCase();

    if (query === "") {
        displayStudents(students);
        return;
    }

    const results = [];
    for (let i = 0; i < students.length; i++) {
        const s = students[i];
        if (
            s.id.toLowerCase().indexOf(query) !== -1 ||
            s.name.toLowerCase().indexOf(query) !== -1
        ) {
            results.push(s);
        }
    }

    displayStudents(results);
}

// ===== FORM VALIDATION =====
function clearErrors() {
    const errorIds = ["idError", "nameError", "emailError", "genderError", "courseError"];
    for (let i = 0; i < errorIds.length; i++) {
        document.getElementById(errorIds[i]).textContent = "";
    }
    const msg = document.getElementById("formMessage");
    msg.className = "message";
    msg.style.display = "none";
    msg.textContent = "";
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function validateForm() {
    clearErrors();
    let isValid = true;

    const id = document.getElementById("studentId").value.trim();
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;
    const genderRadios = document.getElementsByName("gender");

    // Student ID
    if (id === "") {
        document.getElementById("idError").textContent = "Student ID is required.";
        isValid = false;
    } else if (id.length < 3) {
        document.getElementById("idError").textContent = "Student ID must be at least 3 characters.";
        isValid = false;
    } else {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id.toLowerCase() === id.toLowerCase()) {
                document.getElementById("idError").textContent = "This Student ID is already registered.";
                isValid = false;
                break;
            }
        }
    }

    // Name
    if (name === "") {
        document.getElementById("nameError").textContent = "Student name is required.";
        isValid = false;
    } else if (name.length < 2) {
        document.getElementById("nameError").textContent = "Name must be at least 2 characters.";
        isValid = false;
    }

    // Email
    if (email === "") {
        document.getElementById("emailError").textContent = "Email address is required.";
        isValid = false;
    } else if (!isValidEmail(email)) {
        document.getElementById("emailError").textContent = "Please enter a valid email format (e.g. name@example.com).";
        isValid = false;
    }

    // Gender
    let genderSelected = false;
    let genderValue = "";
    for (let i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            genderSelected = true;
            genderValue = genderRadios[i].value;
            break;
        }
    }
    if (!genderSelected) {
        document.getElementById("genderError").textContent = "Please select a gender.";
        isValid = false;
    }

    // Course
    if (course === "") {
        document.getElementById("courseError").textContent = "Please select a course.";
        isValid = false;
    }

    return { isValid, id, name, email, gender: genderValue, course };
}

function getSelectedSkills() {
    const checkboxes = document.getElementsByName("skills");
    const skills = [];
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            skills.push(checkboxes[i].value);
        }
    }
    return skills;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const result = validateForm();

    if (!result.isValid) {
        const msg = document.getElementById("formMessage");
        msg.textContent = "Please correct the errors above before submitting.";
        msg.className = "message error";
        return;
    }

    const newStudent = {
        id: result.id,
        name: result.name,
        email: result.email,
        gender: result.gender,
        course: result.course,
        skills: getSelectedSkills()
    };

    students.push(newStudent);
    saveStudents();

    const msg = document.getElementById("formMessage");
    msg.textContent = "Student registered successfully! You can view the record in the Student Records section.";
    msg.className = "message success";

    document.getElementById("studentForm").reset();
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", function () {
    loadStudents();

    // Navigation
    const navLinks = document.querySelectorAll(".nav-link");
    for (let i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function (e) {
            e.preventDefault();
            const section = this.getAttribute("data-section");
            showSection(section);
        });
    }

    // Home page buttons
    const homeButtons = document.querySelectorAll(".card .btn");
    for (let i = 0; i < homeButtons.length; i++) {
        homeButtons[i].addEventListener("click", function () {
            const section = this.getAttribute("data-section");
            showSection(section);
        });
    }

    // Form
    document.getElementById("studentForm").addEventListener("submit", handleFormSubmit);
    document.getElementById("studentForm").addEventListener("reset", function () {
        setTimeout(clearErrors, 0);
    });

    // Course search
    document.getElementById("courseSearch").addEventListener("input", searchCourses);
    document.getElementById("clearCourseSearch").addEventListener("click", function () {
        document.getElementById("courseSearch").value = "";
        displayCourses(courses);
    });

    // Student search
    document.getElementById("studentSearch").addEventListener("input", searchStudents);
    document.getElementById("clearStudentSearch").addEventListener("click", function () {
        document.getElementById("studentSearch").value = "";
        displayStudents(students);
    });

    // Initial display
    displayCourses(courses);
    displayStudents(students);
});