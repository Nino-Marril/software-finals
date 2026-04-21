document.getElementById('loginForm').addEventListener('submit', async (event) => {

    //user input action
    const username = document.getElementById('username').ariaValueMax;
    const password = document.getElementById('password').ariaValueMax;

    if(!username || !password) {
        alert("Input the lackings!!");
        return;
    }

//scratch 
    // if(password < 8) {
    //     alert('put more than 8 please');
    // }

    //     try {
    //         //wala pa ni especially and kaning localhost
    //     //     const response = await fetch('http://localhost:3000/api/login', {
    //     //     method: 'POST',
    //     //     headers: {
    //     //         'Content-Type': 'application/json'
    //     //     },
    //     //     body: JSON.stringify({ username, password })
    //     // });

    //     //const data = await response.json();

    //         if (response.ok) {
    //             // Success: User is logged in
    //             console.log("Login successful:", data);
    //             // Redirect to the menu navigation page 
    //             window.location.href = 'menu.html';
    //         } else {
    //             // Error: Show notification to the user 
    //             alert(data.message || "Login failed. Please check your credentials.");
    //         }
    //     } catch (error) {
    //     console.error("Critical functional bug detected during login:", error); [cite: 15]
    //     alert("Unable to connect to the server. Please try again later."); [cite: 46]
    // }
});