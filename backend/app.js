import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors'; 
import {Animal, Habitat} from './models/product.model.js'; 
import exhibitRoutes from './exhibit.routes.js';  // Add this line

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

/*app.get('/', (req, res) => {
    res.send('Hello World!!');
});*/


app.use('/api', exhibitRoutes)

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
        console.log("ur mother")
        const animals = await Animal.find();
        return res.status(200).json(animals);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch animals' });
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

app.listen(5001, () => {
    console.log('MongoDB URI:', process.env.MONGO_URI);
    connectDB();
    console.log('Server started at http://localhost:5001');
});


