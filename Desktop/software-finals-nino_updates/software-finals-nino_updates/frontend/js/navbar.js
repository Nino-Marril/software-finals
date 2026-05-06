document.addEventListener("DOMContentLoaded", () => {
  fetch("html/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      highlightActivePage();
    })
    .catch(error => console.error("Error loading the navbar:", error));
});

function highlightActivePage() {
  const path = window.location.pathname;
  const page = path.split("/").pop();

  let activeEl = null;

  if (page === "fish_list.html") {
    activeEl = document.getElementById("nav-fish");
  } else if (page === "chicken.html") {
    activeEl = document.getElementById("nav-chicken");
  } else if (page === "pork.html") {
    activeEl = document.getElementById("nav-pork");
  } else if (page === "beef.html") {
    activeEl = document.getElementById("nav-beef");
  }

  if (activeEl) {
    activeEl.classList.add("active", "fw-bold", "text-success");
    activeEl.classList.remove("text-light");
  }
}