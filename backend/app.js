import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors'; 
import {Animal, Habitat, Exhibit} from './models/product.model.js'; 
//import exhibitRoutes from './exhibit.routes.js';  // Add this line

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

/*app.get('/', (req, res) => {
    res.send('Hello World!!');
});*/


//app.use('/api', exhibitRoutes)

app.post('/animals', async (req, res) => {
    const { species, food } = req.body;

    console.log('Request body:', req.body); // Log the incoming request body for debugging

    // Check if species and food are provided
    if (!species || !food) {
        return res.status(400).json({ error: 'Species and food are required' });
    }

    try {
        const animal = new Animal({ species, food });
        await animal.save();
        console.log('Animal added to database:', animal);
        return res.status(201).json(animal);
    } catch (err) {
        console.error('Error adding animal:', err);
        return res.status(400).json({ error: 'Failed to add animal' });
    }
});


app.get('/animals', async (req, res) => {
    try {
        const animals = await Animal.find();
        return res.status(200).json(animals);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch animals' });
    }
});

  // Route to get all exhibits
  app.get('/exhibits', async (req, res) => {
    try {
      const exhibits = await Exhibit.find().populate('animal');
      return res.status(200).json(exhibits);
    } catch (err) {
      console.log('error', err)
      return res.status(500).json({ error: 'bad exhibit fetching in get request' });
    }
  });
  
  // Route to post a new exhibit
  app.post('/exhibits', async (req, res) => {
    const { animal, capacity, seasonal } = req.body;
  
    console.log('Request body for new exhibit:', req.body);
  
    // Check if required fields are present
    if (!animal || !capacity) {
      return res.status(400).json({ error: 'Animal and capacity are required' });
    }
  
    try {
      const newExhibit = new Exhibit({ animal, capacity, seasonal });
      await newExhibit.save();
      console.log('Exhibit added:', newExhibit);  // Debugging line
      return res.status(201).json(newExhibit);
    } catch (err) {
      console.error('Error adding exhibit:', err);
      return res.status(500).json({ error: 'Failed to add exhibit' });
    }
  });

// Update an animal
app.put('/animals/:id', async (req, res) => {
    const { species, food } = req.body;
    const { id } = req.params;
  
    try {
      const animal = await Animal.findByIdAndUpdate(id, { species, food }, { new: true });
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
      return res.status(200).json(animal);
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update animal' });
    }
  });

  // Delete an animal
app.delete('/animals/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const animal = await Animal.findByIdAndDelete(id);
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
      return res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete animal' });
    }
  });



app.get('/habitats', async (req, res) => {
    const {h_name, ecosystem } = req.body;
    try {
        const habitats = await Habitat.find();
        return res.status(200).json(habitats);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch habitats' });
    }
  });

  app.post('/habitats', async (req, res) => {
    const { h_name, ecosystem } = req.body;
    try {
      console.log("cat")
      const newHabitat = new Habitat({ h_name, ecosystem });
      await newHabitat.save();
      console.log("cat2")
      res.status(201).json(newHabitat);
    } catch (err) {
      res.status(500).json({ message: 'Failed to add habitat' });
    }
  });

// Route to generate filtered exhibit report
app.get('/exhibits/report', async (req, res) => {
  const { minCapacity, maxCapacity, animal, seasonal } = req.query;

  // Build query object
  let query = {};

  // Capacity filtering
  const min = parseInt(minCapacity);
  const max = parseInt(maxCapacity);
  if (min !== -1 && max !== -1) {
    query.capacity = { $gte: min, $lte: max };
  } else if (min !== -1) {
    query.capacity = { $gte: min };
  } else if (max !== -1) {
    query.capacity = { $lte: max };
  }

  // Animal filtering
  if (animal && animal !== 'all') {
    query.animal = animal;
  }

  // Seasonal filtering
  if (seasonal && seasonal !== 'all') {
    query.seasonal = seasonal === 'true';
  }

  try {
    const exhibits = await Exhibit.find(query).populate('animal');
    return res.status(200).json(exhibits);
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});



app.listen(5001, () => {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    connectDB();
    console.log('Server started at http://localhost:5001');
});


