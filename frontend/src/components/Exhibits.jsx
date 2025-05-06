import React, { useState } from 'react';

const ExhibitForm = ({ animals, fetchExhibits }) => {
  const [exhibit, setExhibit] = useState({
    animal: '',
    capacity: '',
    seasonal: false,
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExhibit({
      ...exhibit,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/exhibits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exhibit),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Exhibit added:', data);
        if (fetchExhibits) fetchExhibits();
      } else {
        console.error('Failed to add exhibit');
      }
    } catch (err) {
      console.error('Error adding exhibit:', err);
    }
  };
  

  return (
    <div>
      <h2>Add Exhibit</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="animal"
          value={exhibit.animal}
          onChange={handleChange}
          required
        >
          <option value="">Select Animal</option>
          {animals.length === 0 ? (
            <option disabled>No animals available</option>
          ) : (
            animals.map((animal) => (
              <option key={animal._id} value={animal._id}>
                {animal.species}
              </option>
            ))
          )}
        </select>

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={exhibit.capacity}
          onChange={handleChange}
          required
        />

        <label>
          Seasonal
          <input
            type="checkbox"
            name="seasonal"
            checked={exhibit.seasonal}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Add Exhibit</button>
      </form>
    </div>
  );
};

export default ExhibitForm;
