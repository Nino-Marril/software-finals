// frontend/session-guard.js
(async function checkAuth() {
  // Quick local check first
  const localUser = localStorage.getItem("loggedInUser");

  try {
    const response = await fetch("http://localhost:3000/api/check-session", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok || !data.loggedIn) {
      // Cookie session failed — also clear local storage
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    // If server unreachable but we have a local user, allow through
    if (!localUser) {
      window.location.href = "login.html";
    }
  }
})();