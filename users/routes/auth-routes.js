const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../services/user-model');

router.post('/', async (req, res) => {
    try {

      const { username, password } = req.body;

      // Check if required fields are present in the request body
      if (!username)
        return res.status(400).json({ error: "Missing username" })
      if (!password)
        return res.status(400).json({ error: "Missing password" })

      // Fields length validation, no more validations needed because of the register validations
      if (!username.trim()) {
        return res.status(400).json({ error: "The username is empty" })
      }
      if (!password.trim()) {
        return res.status(400).json({ error: "The password is empty" })
      }

      // Find the user by username in the database
      const user = await User.findOne({ where: { username } });

      // Check if the user exists and verify the password
      if (user && user.username === username && await bcrypt.compare(password, user.password)) {

        // Respond with the user information
        return res.status(200).json({ username, createdAt: user.createdAt, avatar: user.imageUrl });

      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
          // validation errors
          const validationErrors = error.errors.map(err => err.message);
          res.status(400).json({ error: 'Error de validación', details: validationErrors });
      } else {
          // Other errors
          res.status(400).json({ error: error.message });
      }
    }
  });


module.exports = router;
