const bcrypt = require('bcryptjs');

bcrypt.hash('hashed_admin1', 10).then(console.log);
