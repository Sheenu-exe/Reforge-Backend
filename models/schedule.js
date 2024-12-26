
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Daily Schedule'
  },
  scheduleItems: [{
    time: {
      type: String,
      required: true
    },
    activity: {
      type: String,
      required: true
    }
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);

