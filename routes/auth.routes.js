const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");

const User = require("../models/User");
const router = Router();

///api/auth/register
router.post(
  "/register",
  [
    check("email", "Incorrect email.").isEmail(),
    check("password", "Password minimal length is 6 symbols.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect email or password",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Error. Such User already exists." });
      }

      const hashedPassword = await bcrypt.hashSync(password, 12);
      const user = new User({ email, password: hashedPassword });
      await user.save();

      res
        .status(201)
        .json({ message: "User has been registered successfully." });
    } catch (err) {
      res.status(500).json({ message: "Registration error!", error: err });
    }
  }
);

///api/auth/login
router.post(
  "/login",
  [
    check("email", "Login Error. Incorrect email.").normalizeEmail().isEmail(),
    check("password", "Password is required.").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Incorrect email or password when Login",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User is not found." });
      }

      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Login Error: Wrong password." });
      }

      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "1h",
      });

      res.json({ token, userId: user.id });
    } catch (err) {
      res.status(500).json({ message: "Login error!" });
    }
  }
);

module.exports = router;
