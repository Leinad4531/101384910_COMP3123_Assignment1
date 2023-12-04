var express = require('express')
const mongoose = require('mongoose');
var userRoutes = express.Router()
const bcrypt = require('bcrypt');


// User Model
const User = mongoose.model('User', {
    username: String,
    email:{
        type :String ,
        unique : true  // this will check if the entered email is already existing or not in database
    },
    password: String
});


  userRoutes.get('/signup', (req, res) => {
    // Retrieve users from MongoDB
    User.find()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving users' });
    });
});

userRoutes.get('/login', async (req, res) => {
    try {
      // Fetch only username and password fields from the employees in the database
      const user = await User.find({}, 'username password');
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // API Endpoint to handle user signup

  const passwordValidator = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  userRoutes.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate password using the regular expression
    if (!passwordValidator.test(password)) {
        return res.status(400).json({ error: 'Invalid password. Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    if (!emailValidator.test(email)) {
        return res.status(400).json({ error: "Email is not valid, please enter a valid email" });
    }

    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create a new user with the hashed password
        const user = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await user.save();

        res.status(201).json({ 
          status: true,
          message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

  

  userRoutes.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the user exists with the given username or email
      const user = await User.findOne({
        $or: [{ username: username }, { email: username }]
      });

      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!user || !passwordMatch) {
        // User not found or incorrect password
        return res.status(401).json({ 
            status : false,
            message : 'Invalid Username and Password'
         });
      }
  
      // User found and password is correct
        return res.status(200).json({
            status   : true ,
            username : username,
            message  : 'Login Successfully',
            // token    : jwt.sign({ id: user._id}, process.env.JWT_SECRET),

        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});
  
  module.exports = userRoutes;
