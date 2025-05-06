import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors'; 
import {Animal, Habitat, Exhibit} from './models/product.model.js'; 
import mongoSanitize from 'express-mongo-sanitize';
//import exhibitRoutes from './exhibit.routes.js';  // Add this line
dotenv.config();
const app = express();
app.use(express.json());
app.use(mongoSanitize());
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

/*app.get('/exhibits/report', async (req, res) => {
  const { minCapacity, maxCapacity, animal, seasonal } = req.query;

  // Build query object for filtering
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
    // Aggregation pipeline to calculate average capacity and count animal species
    const aggregation = await Exhibit.aggregate([
      { $match: query },  // Apply query filters

      // Stage to calculate the average capacity
      { 
        $group: {
          _id: null,  // We are calculating the average for the whole result
          avgCapacity: { $avg: "$capacity" },  // Average capacity
          animals: { $push: "$animal" },  // Collect all animal references
        }
      },
    ]);

    if (aggregation.length > 0) {
      const { avgCapacity, animals } = aggregation[0];

      // Look up animal species by IDs
      const animalIds = animals.map(a => a.toString());
      
      // Fetch animal species in bulk based on the animal references we gathered
      const animalRecords = await Animal.find({ '_id': { $in: animalIds } });

      // Map animal records to their species for easier counting
      const speciesList = animalRecords.map(animal => animal.species);

      // Count frequencies of each species
      const animalFrequency = speciesList.reduce((counts, species) => {
        counts[species] = (counts[species] || 0) + 1;
        return counts;
      }, {});

      // Find the most common animal (species with the highest frequency)
      const mostCommonAnimal = Object.entries(animalFrequency).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ["", 0]
      )[0];

      // Send the response with average capacity and most common animal
      return res.status(200).json({
        averageCapacity: avgCapacity.toFixed(2),
        mostCommonAnimal
      });
    } else {
      return res.status(200).json({
        averageCapacity: "0",
        mostCommonAnimal: ""
      });
    }
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});*/

/*app.get('/exhibits/report', async (req, res) => {
  const { minCapacity, maxCapacity, animal, seasonal } = req.query;

  // Build query object for filtering
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
    // Aggregation pipeline for calculating average capacity and counting animal species
    const aggregation = await Exhibit.aggregate([
      { $match: query },  // Apply query filters

      // Stage 1: Lookup to get animal species data from the Animal collection
      {
        $lookup: {
          from: 'animals', // Name of the collection to join with
          localField: 'animal',
          foreignField: '_id',
          as: 'animalDetails'
        }
      },

      // Stage 2: Unwind the animalDetails to make it easier to work with
      {
        $unwind: '$animalDetails'
      },

      // Stage 3: Group by species and count the occurrences of each animal species
      {
        $group: {
          _id: '$animalDetails.species',  // Group by species
          count: { $sum: 1 },             // Count the occurrences of each species
          avgCapacity: { $avg: "$capacity" }  // Calculate average capacity for each group
        }
      },

      // Stage 4: Sort by count in descending order (most common animal first)
      {
        $sort: { count: -1 }
      },

      // Stage 5: Limit the result to just one entry (most common animal)
      {
        $limit: 1
      }
    ]);

    if (aggregation.length > 0) {
      return res.status(200).json(aggregation);  // Return the aggregation array directly
    } else {
      return res.status(200).json([]);  // Return an empty array if no results are found
    }
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});*/



app.listen(5001, () => {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    connectDB();
    console.log('Server started at http://localhost:5001');
});


