const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    // check if email exist
    const emailExist = await User.findOne({ email: req.body.email });
    // if email is used
    if (emailExist)
      res.status(401).json({ error: "This email is already used" });
    // no errors
    else {
      // encrypt the password
      const encryptedPass = await bcrypt.hash(req.body.password, 10);
      // craete new user
      const newUser = new User({
        email: req.body.email.toLowerCase(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gander: req.body.gander,
        age: req.body.age,
        password: encryptedPass,
      });
      // save the new user
      const user = await newUser.save();
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // search for the email
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    // if user not exist
    if (!user) res.status(401).json("User not found");
    // no errors
    else {
      // check password
      const passMatchs = await bcrypt.compare(req.body.password, user.password);
      // wrong password
      if (!passMatchs) res.status(401).json("Invalid password");
      // no errors
      else {
        // create login token
        const token = jwt.sign(
          { id: user._id, isDoctor: user.isDoctor },
          process.env.SECRET_KEY,
          { expiresIn: "5d" }
        );
        // send the response
        res.status(200).json({ user, token });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
});

module.exports = router;

// www.mantho.com/api/auth/register => POST
// www.mantho.com/api/auth/login

// => send data on => www.mantho.com/api/auth/register
// => status code 200 , {}