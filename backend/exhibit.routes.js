/*import express from 'express';
import {Exhibit} from './models/product.model.js';  // Adjust the path if necessary

const router = express.Router();

// Route to get all exhibits
router.get('/exhibits', async (req, res) => {
  try {
    console.log("hihi")
    const exhibits = await Exhibit.find().populate('animal habitat');
    console.log("hihi2")
    return res.status(200).json(exhibits);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch exhibits' });
  }
});

router.post('/exhibits', async (req, res) => {
  const { animal, habitat, capacity, seasonal } = req.body;

  // Log incoming request body for debugging
  console.log('Request body for new exhibit:', req.body);

  // Check if required fields are present
  if (!animal || !capacity) {
    return res.status(400).json({ error: 'Animal and capacity are required' });
  }

  try {
    // Create a new exhibit document
    const newExhibit = new Exhibit({
      animal,
      habitat,
      capacity,
      seasonal,
    });

    // Save the new exhibit to the database
    await newExhibit.save();
    console.log('Exhibit added to database:', newExhibit);

    // Return the newly created exhibit
    return res.status(201).json(newExhibit);
  } catch (err) {
    console.error('Error adding exhibit:', err);
    return res.status(500).json({ error: 'Failed to add exhibit' });
  }
});

router.get('/exhibits/filter', async (req, res) => {
  const min = parseInt(req.query.min, 10);
  const max = parseInt(req.query.max, 10);

  const query = {};

  if (!isNaN(min) && min >= 0) {
    query.capacity = { ...query.capacity, $gte: min };
  }
  if (!isNaN(max) && max >= 0) {
    query.capacity = { ...query.capacity, $lte: max };
  }

  try {
    const exhibits = await Exhibit.find(query).populate('animal habitat');
    return res.status(200).json(exhibits);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch filtered exhibits' });
  }
});

export default router;*/
