const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  description: { type: String },
  createDate: Date,
  finishDate: Date,
  status: String,
  project :{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Project'
  } 
})


module.exports = mongoose.model('Task', TaskSchema);