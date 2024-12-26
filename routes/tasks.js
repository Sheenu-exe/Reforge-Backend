
const express = require('express');
const router = express.Router();
const Schedule = require('../models/schedule');

// Get all schedules
router.get('/', async (req, res) => {
  try {
    const schedules = await Schedule.find();
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
    notes: req.body.notes
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
    const schedule = await Schedule.findById(req.params.id);
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
    console.log('Delete request for task:', req.params.id);
    
    const task = await Task.findByIdAndDelete(req.params.id);
    console.log('Delete result:', task);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;