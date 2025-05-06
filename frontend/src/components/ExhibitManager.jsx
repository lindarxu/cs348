import React, { useState, useEffect } from 'react';

const ExhibitManager = ({ animals }) => {
  const [exhibits, setExhibits] = useState([]);
  const [exhibit, setExhibit] = useState({
    animal: '',
    capacity: '',
    seasonal: false,
  });

  // Fetch exhibits from the backend
  const fetchExhibits = async () => {
    try {
      const response = await fetch('http://localhost:5001/exhibits');
      if (response.ok) {
        const data = await response.json();
        setExhibits(data);
      } else {
        console.error('Failed to fetch exhibits');
      }
    } catch (err) {
      console.error('Error fetching exhibits:', err);
    }
  };

  useEffect(() => {
    fetchExhibits();
  }, []);

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
        fetchExhibits(); // Refresh list after adding
        // Reset form
        setExhibit({ animal: '', capacity: '', seasonal: false });
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

      <h2>Exhibit List</h2>
      <table>
        <thead>
          <tr>
            <th>Animal</th>
            <th>Capacity</th>
            <th>Seasonal</th>
          </tr>
        </thead>
        <tbody>
          {exhibits.length === 0 ? (
            <tr>
              <td colSpan="3">No exhibits available</td>
            </tr>
          ) : (
            exhibits.map((exhibit) => (
              <tr key={exhibit._id}>
                <td>{exhibit.animal?.species || 'Unknown'}</td>
                <td>{exhibit.capacity}</td>
                <td>{exhibit.seasonal ? 'Yes' : 'No'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExhibitManager;
