import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  species: { type: String, required: true, unique: true },
  food: { type: String, required: true },
});

// Create a unique index for the species field to prevent duplicates
//animalSchema.index({ species: 1 }, { unique: true });

const habitatSchema = new mongoose.Schema ({
    h_id: Number, 
    h_name: String,
    ecosystem: String
})
const exhibitSchema = new mongoose.Schema ({
    /* referring to the animal and habitat */
    animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
    habitat: { type: mongoose.Schema.Types.ObjectId, ref: 'Habitat'},
    capacity: Number, 
    seasonal: Boolean
})


const Animal = mongoose.model('Animal', animalSchema);
export {Animal};

const Habitat = mongoose.model('Habitat', habitatSchema);
export {Habitat};

const Exhibit = mongoose.model('Exhibit', exhibitSchema);
export {Exhibit};