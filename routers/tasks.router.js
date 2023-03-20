const router = require("express").Router();
const Task = require("../models/Task.model");
const User = require("../models/User.model");
const verifyToken = require("../middlewares/verifyToken");

// Create task
router.post("/", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    console.log(req.tokenData);
    try {
      // Get the name of the doctor
      const doc = await User.findById(req.tokenData.id);
      // create the task
      const newTask = new Task({
        doctorId: req.tokenData.id,
        doctorName: doc.firstName + " " + doc.lastName,
        patientEmail: req.body.patientEmail,
        content: req.body.content,
      });
      // save the new task
      await newTask.save();
      // send the response
      res.status(200).json({ newTask });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Delete task
router.delete("/:id", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor) {
    try {
      // delete the exercise
      await Task.findByIdAndDelete(req.params.id);
      // send the response
      res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Update task
router.patch("/:id", verifyToken, async (req, res) => {
  // check the user identity
  if (req.tokenData.isDoctor || req.tokenData.id) {
    try {
      // update exercise information
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      // send the response
      res.status(200).json({ updatedTask });
    } catch (err) {
      res.status(500).json(err);
    }
  } else res.status(401).json({ error: "You are not authorized" });
});

// Get all tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    // Patient Email
    if (req.tokenData.isDoctor || req.tokenData.id) {
      const { patientEmail } = req.query;
      const tasks = await Task.find({ patientEmail });
      if (tasks) res.status(200).json(tasks);
      else res.status(404).json({ error: "No Tasks Found" });
    } else res.status(404).json({ error: "You Are Not Authorized" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
