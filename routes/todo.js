const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { verifyAuth } = require('../firebaseAdmin');

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);

// Middleware to verify auth
router.use(verifyAuth);

// Get todos for current user
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.uid })
      .sort({ dueDate: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    name: req.body.name,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
    completed: req.body.completed || false,
    userId: req.user.uid // Use the authenticated user's ID
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.uid // Ensure todo belongs to user
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    if (req.body.name) todo.name = req.body.name;
    if (req.body.dueDate) todo.dueDate = req.body.dueDate;
    if (req.body.priority) todo.priority = req.body.priority;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.uid // Ensure todo belongs to user
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    await todo.deleteOne();
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;