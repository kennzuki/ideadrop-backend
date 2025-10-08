import express from 'express';
import Idea from '../models/Ideas.js';
const router = express.Router();
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware.js';

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
router.post('/',protect,  async (req, res, next) => {
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
     user: req.user._id
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

//delete 
router.delete('/:id',protect, async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
    const idea = await Idea.findById(id);
    if(!idea){
      return res.status(404).json({ error: 'Idea not found' });
    }
    //check user owns the idea
    if(idea.user.toString() !== req.user._id){
      res.status(403);
      throw new Error('User not authorized to delete');
    }
    await idea.deleteOne();

    res.json({ message: 'Idea deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// update idea

// @route           PUT /api/ideas/:id
// @description     Update idea
// @access          Public
router.put('/:id', protect, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findById(id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea not found');
    }

    // Check if user owns idea
    if (idea.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this idea');
    }

    const { title, summary, description, tags } = req.body || {};

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    idea.title = title;
    idea.summary = summary;
    idea.description = description;
    idea.tags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const updatedIdea = await idea.save();

    res.json(updatedIdea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;
