const bcrypt = require("bcrypt");

bcrypt.hash("customer", 10).then(console.log);