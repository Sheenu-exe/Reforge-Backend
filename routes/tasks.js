const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  scheduleItems: [{
    time: String,
    activity: String
  }],
  notes: String,
  userId: {
    type: String,
    required: true,
    index: true // Add index for better query performance
  }
}, {
  timestamps: true
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Updated Express Router
const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../firebaseAdmin');

// Apply auth middleware to all routes
router.use(verifyAuth);

// Get user's schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.user.uid });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new schedule
router.post('/', async (req, res) => {
  const schedule = new Schedule({
    title: req.body.title,
    scheduleItems: req.body.scheduleItems,
    notes: req.body.notes,
    userId: req.user.uid // Add user ID from verified token
  });

  try {
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific schedule
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ 
      _id: req.params.id,
      userId: req.user.uid // Ensure user owns the schedule
    });
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ 
      _id: req.params.id,
      userId: req.user.uid // Ensure user owns the schedule
    });
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    
    await schedule.deleteOne();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;