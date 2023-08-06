const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "ankitisagood$boy"

// ROUTE:1 :- Create a user using POST "/api/auth/createuser". No login required
router.post('/createuser', [
   body('name', 'enter a valid name').isLength({ min: 3 }),
   body('email', 'enter a valid email').isEmail(),
   body('password', 'Password must atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
   let success = false;
   // if there are errors, return Bad request
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }

   try {
      // Check wheather the user with same email already exist
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({success, error: "sorry a user with same email exist" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create new user
      user = await User.create({
         name: req.body.name,
         password: secPass,
         email: req.body.email,
      });

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, user })

   } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured" );

   }
})

//ROUTE:2 :- Authenticate a user using POST "/api/auth/login". No login required

router.post('/login', [
   body('email', 'enter a valid email').isEmail(),
   body('password', 'Password cannot be blank').exists()
], async (req, res) => {
   // if there are errors, return Bad request
   let success =false;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const {email, password} = req.body;
   try {
      let user = await User.findOne({email});
      if(!user){
      success = false;
         return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
         success = false;
         return res.status(400).json({success, error: "Please try to login with correct credentials"});
      }

      const data = {
         user: {
            id: user.id
         }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken })

   }  catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error" );
   }

});

// ROUTE:3 :- Get logged in User details using : POST "api/auth/getuser" Login required
router.post('/getuser', fetchuser, async (req, res) => {
  
try {
   userId = req.user.id;
   const user = await User.findById(userId).select("-password");
   res.send(user);
}  catch (error) {
   console.error(error.message);
   res.status(500).send("Internal server Error" );
}
});

module.exports = router;