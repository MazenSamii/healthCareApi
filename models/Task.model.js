const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    patientEmail: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    content: [
      {
        name: String,
        category: String,
        desc: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
