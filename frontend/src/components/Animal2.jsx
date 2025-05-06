import React, { useState, useEffect } from 'react';

const Animal2 = ({ animals, setAnimals, clearAnimalList }) => {
  const [newAnimal, setNewAnimal] = useState({ species: '', food: '' });
  const [editingAnimal, setEditingAnimal] = useState(null); // To track which animal is being edited

  // Handle form submit to add new animal or update existing animal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAnimalData = { species: newAnimal.species, food: newAnimal.food };

    try {
      if (editingAnimal) {
        // If editing, update the animal
        const response = await fetch(`http://localhost:5001/animals/${editingAnimal._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAnimalData),
        });

        if (response.ok) {
          const updatedAnimal = await response.json();
          setAnimals((prevAnimals) =>
            prevAnimals.map((animal) =>
              animal._id === updatedAnimal._id ? updatedAnimal : animal
            )
          );
          setEditingAnimal(null); // Reset editing mode
          setNewAnimal({ species: '', food: '' });
        } else {
          console.error('Failed to update animal');
        }
      } else {
        // If adding new animal, make POST request
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
      }
    } catch (err) {
      console.error('Error adding or updating animal:', err);
    }
  };

  // Handle editing an animal
  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setNewAnimal({ species: animal.species, food: animal.food });
  };

  // Handle deleting an animal
  const handleDelete = async (animalId) => {
    try {
      const response = await fetch(`http://localhost:5001/animals/${animalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAnimals((prevAnimals) => prevAnimals.filter((animal) => animal._id !== animalId));
      } else {
        console.error('Failed to delete animal');
      }
    } catch (err) {
      console.error('Error deleting animal:', err);
    }
  };

  return (
    <div>
      <h2>{editingAnimal ? 'Edit Animal' : 'Add Animal'}</h2>
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
        <button type="submit">{editingAnimal ? 'Update Animal' : 'Add Animal'}</button>
      </form>

      <h2>Animal List</h2>
      <button onClick={clearAnimalList} className="clear-btn">Clear List</button>
      <table>
        <thead>
          <tr>
            <th>Species</th>
            <th>Food</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.length === 0 ? (
            <tr>
              <td colSpan="3">No animals available</td>
            </tr>
          ) : (
            animals.map((animal) => (
              <tr key={animal._id}>
                <td>{animal.species}</td>
                <td>{animal.food}</td>
                <td>
                  <button onClick={() => handleEdit(animal)}>Edit</button>
                  <button onClick={() => handleDelete(animal._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Animal2;
