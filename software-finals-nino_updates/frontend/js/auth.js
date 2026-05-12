const loginForm = document.getElementById("loginForm");
const messageBox = document.getElementById("messageBox");
const loginButton = document.getElementById("loginButton");

function showMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message hidden";
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showMessage("Please enter your username and password.", "error");
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || "Login failed. Please try again.", "error");
      return;
    }

    showMessage("Login successful. Redirecting...", "success");

    localStorage.setItem("loggedInUser", JSON.stringify(data.user));

    setTimeout(() => {
      window.location.href = "menu.html";
    }, 900);
  } catch (error) {
    console.error("Login request failed:", error);
    showMessage("Unable to connect to the server. Please check if backend is running.", "error");
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Login";
  }
});