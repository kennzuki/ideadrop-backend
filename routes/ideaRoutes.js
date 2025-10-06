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

// Create a new idea
router.post('/', async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
    });
    const savedIdeas = await newIdeas.save();
    res.status(201).json(savedIdeas);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//delete 
router.delete('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
    const idea = await Idea.findByIdAndDelete(id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(idea);
  } catch (err) {
    next(err);
  }
});

// update idea

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
      const updatedIdea = await Idea.findByIdAndUpdate(id, {
          title,
          summary,
          description,
          tags:Array.isArray(tags)?tags:tags.split(',').map((tag) => tag.trim()),
    }, { new: true,runValidators: true });
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    res.json(updatedIdea)
  } catch (err) {
    next(err);
  }
})

export default router;
