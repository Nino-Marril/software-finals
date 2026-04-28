const bcrypt = require("bcrypt");

bcrypt.hash("customer", 10).then(console.log);

const hash = "$2b$10$5rA4YX.KlGc2E7Zn9TllLuIxEz3M6fg46j0OpbRHKhD3mreWA68pi";

bcrypt.compare("customer", hash).then(result => {
  console.log("MATCH:", result);
});