document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const messageBox = document.getElementById("messageBox");

  // Reset message
  messageBox.classList.remove("hidden", "error", "success");

  // Validation
  if (!fullname || !email || !username || !password || !confirmPassword) {
    messageBox.textContent = "All fields are required.";
    messageBox.classList.add("error");
    return;
  }

  if (password !== confirmPassword) {
    messageBox.textContent = "Passwords do not match.";
    messageBox.classList.add("error");
    return;
  }

  if (password.length < 6) {
    messageBox.textContent = "Password must be at least 6 characters.";
    messageBox.classList.add("error");
    return;
  }

  // Simulated success
  messageBox.textContent = "Registration successful! You can now log in.";
  messageBox.classList.add("success");

  // Optional: redirect after 2 seconds
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
});