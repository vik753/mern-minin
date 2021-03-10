const { Router } = require("express");
const { nanoid } = require("nanoid");
const Link = require("../models/Link");
const router = Router();
const config = require("config");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/generate", authMiddleware, async (req, res) => {
  try {
    const baseUrl = config.get("baseUrl");
    const { from } = req.body;

    const code = nanoid();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();
    res.status(201).json({ link });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Links router '/generate' error!", error: err });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    // req.user.userId - because authMiddleware
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: "Links router '/' error!", error: err });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (err) {
    res.status(500).json({ message: "Links router '/:id' error!", error: err });
  }
});

module.exports = router;
