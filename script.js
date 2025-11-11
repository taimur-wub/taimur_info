// ===========================
// Navigation and Section Setup
// ===========================

const navLinks = document.querySelectorAll("header nav a");
const sectionPlaceholders = document.querySelectorAll(".section-placeholder");

// ===========================
// Theme Toggle
// ===========================

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");

// Default to light if nothing stored
const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme || "light";
document.documentElement.setAttribute("data-theme", initialTheme);
themeIcon.className = initialTheme === "light" ? "fas fa-sun" : "fas fa-moon";

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeIcon.className = next === "light" ? "fas fa-sun" : "fas fa-moon";
}

themeToggle.addEventListener("click", toggleTheme);

// ===========================
// Section Map
// ===========================

const sectionMap = {
  about: "sections/about.html",
  education: "sections/education.html",
  experience: "sections/experience.html",
  projects: "sections/projects.html",
  activities: "sections/activities.html"
};

// ===========================
// Load Section
// ===========================

function loadSection(id) {
  const placeholder = document.getElementById(id);
  if (!placeholder) return;

  placeholder.innerHTML = "";

  const sectionPath = sectionMap[id];
  if (!sectionPath) return;

  fetch(sectionPath)
    .then(response => response.text())
    .then(html => {
      placeholder.innerHTML = html;

      const section = placeholder.querySelector("section");
      if (section) {
        // Clear previous active sections
        document
          .querySelectorAll(".section-placeholder section.active-section")
          .forEach(sec => sec.classList.remove("active-section"));

        section.classList.add("active-section");

        const nav = document.querySelector("header nav");
        const navHeight = nav ? nav.offsetHeight : 0;
        const offsetTop =
          section.getBoundingClientRect().top +
          window.pageYOffset -
          navHeight -
          20;

        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    })
    .catch(error => {
      console.error(`Error loading section ${id}:`, error);
      placeholder.innerHTML = `
        <section id="${id}" class="active-section">
          <div class="section-header"><h2>Error</h2></div>
          <p>Failed to load content.</p>
        </section>
      `;
    });
}

// ===========================
// Show Section
// ===========================

function showSection(id) {
  if (!sectionMap[id]) return;

  document
    .querySelectorAll(".section-placeholder section.active-section")
    .forEach(sec => sec.classList.remove("active-section"));

  loadSection(id);
}

// ===========================
// Navigation Events
// ===========================

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);

    if (!sectionMap[targetId]) return;

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    showSection(targetId);
    window.history.pushState(null, "", "#" + targetId);
  });
});

// ===========================
// Initial Load
// ===========================

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1) || "about";
  const initial = sectionMap[hash] ? hash : "about";

  const activeLink = document.querySelector(
    `header nav a[href="#${initial}"]`
  );
  if (activeLink) {
    navLinks.forEach(l => l.classList.remove("active"));
    activeLink.classList.add("active");
  }

  showSection(initial);
});

// ===========================
// Handle Back/Forward
// ===========================

window.addEventListener("hashchange", () => {
  const hash = window.location.hash.substring(1);
  if (!sectionMap[hash]) return;

  navLinks.forEach(l => l.classList.remove("active"));
  const current = document.querySelector(
    `header nav a[href="#${hash}"]`
  );
  if (current) current.classList.add("active");

  showSection(hash);
});