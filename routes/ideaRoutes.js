import express from 'express';
import Idea from '../models/Ideas.js';
const router = express.Router();
import mongoose from 'mongoose';

// Get all ideas
router.get('/', async (req, res, next) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    next(err);
  }
});

// Get idea by ID
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
    const idea = await Idea.findById(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (err) {
    next(err);
  }
});

// // Create a new idea
// router.post('/', async (req, res, next) => {
//   try {
//     const { title } = req.body;
//     if (!title) {
//       return res.status(400).json({ error: 'Title is required' });
//     }
//     const newIdea = await Idea.create({ title });
//     res.status(201).json(newIdea);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;