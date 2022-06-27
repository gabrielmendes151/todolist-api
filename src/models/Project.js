const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ]
  
})


module.exports = mongoose.model('Project', ProjectSchema);