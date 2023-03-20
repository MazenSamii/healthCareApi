const router = require("express").Router();
const Exercise = require("../models/Exercise.model");
const verifyToken = require("../middlewares/verifyToken");

// Create exercise
router.post("/", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    try {
      // create the exercise
      // check if the exercise is exist
      const nameIsUsed = await Exercise.findOne({ name: req.body.name });
      if (nameIsUsed) {
        res.status(500).json({ error: "This exercise is already exist" });
      } else {
        const newExercise = new Exercise({
          name: req.body.name,
          category: req.body.category,
          desc: req.body.desc,
          image: req.body.image,
        });
        // save the new exercise
        await newExercise.save();
        // send the response
        res
          .status(200)
          .json({ message: "Exercise created successfully", newExercise });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Delete exercise
router.delete("/:id", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    try {
      // delete the exercise
      await Exercise.findByIdAndDelete(req.params.id);
      // send the response
      res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Update user
router.patch("/:id", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    try {
      // update exercise information
      const updatedExercise = await Exercise.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      // send the response
      res
        .status(200)
        .json({ message: "Exercise updated successfully", updatedExercise });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Get single exercise
router.get("/:id", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    try {
      const exercise = await Exercise.findById(req.params.id);
      if (exercise) {
        // send the response
        res.status(200).json(exercise);
      }
      // exercise not found
      else res.status(404).json({ error: "Exercise not found" });
    } catch (error) {
      res.status(500).json(error);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Get all exercises
router.get("/", verifyToken, async (req, res) => {
  if (req.tokenData.isDoctor) {
    try {
      // get users information
      const exercises = await Exercise.find(
        req.query.category ? { category: req.query.category } : {}
      );
      if (exercises) {
        // send the response
        res.status(200).json(exercises);
      }
      // no users
      else res.status(404).json({ error: "No exercises" });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

module.exports = router;
