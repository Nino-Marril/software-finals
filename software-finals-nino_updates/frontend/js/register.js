document.getElementById("registerForm")
  .addEventListener("submit", async function (e) {

    e.preventDefault();

    const fullname =
      document.getElementById("fullname").value.trim();

    const email =
      document.getElementById("email").value.trim();

    const username =
      document.getElementById("username").value.trim();

    const password =
      document.getElementById("password").value;

    const confirmPassword =
      document.getElementById("confirmPassword").value;

    const messageBox =
      document.getElementById("messageBox");

    messageBox.classList.remove(
      "hidden",
      "error",
      "success"
    );

    // VALIDATION
    if (
      !fullname ||
      !email ||
      !username ||
      !password ||
      !confirmPassword
    ) {

      messageBox.textContent =
        "All fields are required.";

      messageBox.classList.add("error");

      return;
    }

    if (password !== confirmPassword) {

      messageBox.textContent =
        "Passwords do not match.";

      messageBox.classList.add("error");

      return;
    }

    if (password.length < 6) {

      messageBox.textContent =
        "Password must be at least 6 characters.";

      messageBox.classList.add("error");

      return;
    }

    try {

      const response = await fetch(
        "http://localhost:3000/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullname,
            email,
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {

        messageBox.textContent = data.message;

        messageBox.classList.add("error");

        return;
      }

      messageBox.textContent =
        "Registration successful!";

      messageBox.classList.add("success");

      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);

    } catch (error) {

      console.error(error);

      messageBox.textContent =
        "Cannot connect to server.";

      messageBox.classList.add("error");
    }
});