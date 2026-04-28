document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password, role })
    });

    const data = await res.json();

    const messageDiv = document.getElementById("message");

    if (data.success) {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Account created successfully!";
    } else {
      messageDiv.style.color = "red";
      messageDiv.textContent = data.message;
    }

  } catch (err) {
    console.error(err);
    document.getElementById("message").textContent = "Server error.";
  }
});