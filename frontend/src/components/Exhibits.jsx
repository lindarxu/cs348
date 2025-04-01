import React, { useState } from 'react';

const ExhibitForm = ({ animals }) => {
  const [exhibit, setExhibit] = useState({
    animal: '',
    habitat: '',
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

  // Handle form submit for adding or updating an exhibit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send exhibit data to the server (update logic omitted)
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
