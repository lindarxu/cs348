import React, { useState, useEffect } from 'react';

const ExhibitTable = () => {
  const [exhibits, setExhibits] = useState([]);

  // Fetch exhibits from the backend
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await fetch('http://localhost:5001/exhibits');
        if (response.ok) {
          const data = await response.json();
          setExhibits(data); // Set the exhibits data in state
        } else {
          console.error('Failed to fetch exhibits');
        }
      } catch (err) {
        console.error('Error fetching exhibits:', err);
      }
    };

    fetchExhibits();
  }, []);

  return (
    <div>
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
              <td colSpan="4">No exhibits available</td>
            </tr>
          ) : (
            exhibits.map((exhibit) => (
              <tr key={exhibit._id}>
                <td>{exhibit.animal.species}</td>
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

export default ExhibitTable;
