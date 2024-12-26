const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create Habit Schema
const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Habit = mongoose.model('Habit', habitSchema);

// Get all habits
router.get('/', async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new habit
router.post('/', async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    streak: req.body.streak || 0,
    completed: req.body.completed || false
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a habit
router.put('/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (req.body.name) habit.name = req.body.name;
    if (req.body.streak !== undefined) habit.streak = req.body.streak;
    if (req.body.completed !== undefined) habit.completed = req.body.completed;

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a habit
router.delete('/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await habit.deleteOne();
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;