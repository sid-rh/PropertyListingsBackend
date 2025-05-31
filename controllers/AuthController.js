const User=require('../models/User');
const jwt=require('jsonwebtoken');

const Register= async(req,res)=>{
    try {

        const { name, email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          error: 'User already exists'
        });
      }

      // Create user
      user = await User.create({
        name,
        email,
        password
      });

      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const Login=async(req,res)=>{
    try {
        const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports={Register,Login};