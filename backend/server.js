const bcrypt = require('bcrypt');
const saltRounds = 10; // Standard for secure hashing

async function registerUser(username, plainPassword) {
    // 1. Generate salt and hash the password
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    // 2. Store 'hashedPassword' in your Database 
    // SQL example: INSERT INTO users (username, password_hash) VALUES (?, ?)
    console.log(`Storing ${username} with hash: ${hashedPassword}`);
}

async function loginUser(username, submittedPassword) {
    // 1. Retrieve the stored hash from the database [cite: 56, 59]
    const storedHash = "$2b$10$ExampleHashValue..."; 

    // 2. Compare the submitted password with the stored hash
    const match = await bcrypt.compare(submittedPassword, storedHash);

    if (match) {
        // Create secure session [cite: 51, 56]
        return { success: true };
    } else {
        return { success: false };
    }
}