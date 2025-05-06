import React, { useState } from 'react';

const Animal2 = ({ animals, setAnimals, clearAnimalList }) => {
  const [newAnimal, setNewAnimal] = useState({ species: '', food: '' });

  // Handle form submit to add new animal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnimalData = { species: newAnimal.species, food: newAnimal.food };

    try {
      const response = await fetch('http://localhost:5001/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnimalData),
      });

      if (response.ok) {
        const addedAnimal = await response.json();
        setAnimals((prevAnimals) => [...prevAnimals, addedAnimal]);
        setNewAnimal({ species: '', food: '' });
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
          value={newAnimal.species}
          onChange={(e) => setNewAnimal({ ...newAnimal, species: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Food"
          value={newAnimal.food}
          onChange={(e) => setNewAnimal({ ...newAnimal, food: e.target.value })}
          required
        />
        <button type="submit">Add Animal</button>
      </form>

      <h2>Animal List</h2>
      <button onClick={clearAnimalList} className="clear-btn">Clear List</button>
      <table>
        <thead>
          <tr>
            <th>Species</th>
            <th>Food</th>
          </tr>
        </thead>
        <tbody>
          {animals.length === 0 ? (
            <tr>
              <td colSpan="2">No animals available</td>
            </tr>
          ) : (
            animals.map((animal) => (
              <tr key={animal._id}>
                <td>{animal.species}</td>
                <td>{animal.food}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Animal2;
