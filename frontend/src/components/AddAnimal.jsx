/*import React, { useState } from 'react';

const AddAnimal = ({ setAnimals }) => {
  const [species, setSpecies] = useState('');
  const [food, setFood] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnimal = { species, food };

    try {
      const response = await fetch('http://localhost:5001/animals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnimal),
      });

      if (response.ok) {
        const addedAnimal = await response.json();
        setAnimals((prevAnimals) => [...prevAnimals, addedAnimal]); // Add new animal to the list
        setSpecies('');
        setFood('');
      } else {
        console.error('Failed to add animal');
      }
    } catch (err) {
      console.error('Error adding animal:', err);
    }
  };

  return (
    <div>
      <h2>Add Animal</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Species"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          required
        />
        <button type="submit">Add Animal</button>
      </form>
    </div>
  );
};

export default AddAnimal;*/
