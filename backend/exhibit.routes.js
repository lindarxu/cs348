import express from 'express';
import { Exhibit } from './models/product.model.js';
import { Animal } from './models/product.model.js'; // Import Animal model for population
import { Habitat } from './models/product.model.js';

const router = express.Router();

// Get all exhibits
router.get('/exhibits', async (req, res) => {
  try {
    const exhibits = await Exhibit.find()
      .populate('animal')
      .populate('habitat'); // Populate animal and habitat data
    res.status(200).json(exhibits);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exhibits' });
  }
});

// Add a new exhibit
router.post('/exhibits', async (req, res) => {
  const { animal, habitat, capacity, seasonal } = req.body;

  try {
    const newExhibit = new Exhibit({ animal, habitat, capacity, seasonal });
    await newExhibit.save();
    res.status(201).json(newExhibit);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add exhibit' });
  }
});

// Update an existing exhibit
router.put('/exhibits/:id', async (req, res) => {
  const { id } = req.params;
  const { animal, habitat, capacity, seasonal } = req.body;

  try {
    const updatedExhibit = await Exhibit.findByIdAndUpdate(
      id,
      { animal, habitat, capacity, seasonal },
      { new: true }
    )
      .populate('animal')
      .populate('habitat');
    res.status(200).json(updatedExhibit);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update exhibit' });
  }
});

// Delete an exhibit
router.delete('/exhibits/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Exhibit.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete exhibit' });
  }
});

export default router;
