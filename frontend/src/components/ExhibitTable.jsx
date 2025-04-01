/*import React, { useEffect, useState } from 'react';

const ExhibitTable = () => {
  const [exhibits, setExhibits] = useState([]);

  // Fetch exhibits when the component mounts
  useEffect(() => {
    const fetchExhibits = async () => {
      try {
        const response = await fetch('http://localhost:5001/exhibits');
        if (response.ok) {
          const data = await response.json();
          setExhibits(data); // Set exhibits data in state
        } else {
          console.error('Failed to fetch exhibits');
        }
      } catch (err) {
        console.error('Error fetching exhibits:', err);
      }
    };

    fetchExhibits();
  }, []);

  // Function to clear the exhibit list
  const clearExhibitList = () => {
    setExhibits([]); // Clear the list of exhibits
  };

  return (
    <div>
      <h2>Exhibit List</h2>
      <button onClick={clearExhibitList} className="clear-btn">
        Clear List
      </button>
      <table>
        <thead>
          <tr>
            <th>Animal Species</th>
            <th>Habitat Name</th>
            <th>Capacity</th>
            <th>Seasonal</th>
          </tr>
        </thead>
        <tbody>
          {exhibits.map((exhibit) => (
            <tr key={exhibit._id}>
              <td>{exhibit.animal?.species || 'Unknown'}</td>
              <td>{exhibit.habitat?.h_name || 'Unknown'}</td>
              <td>{exhibit.capacity}</td>
              <td>{exhibit.seasonal ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExhibitTable;*/
