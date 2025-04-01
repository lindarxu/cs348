import React, { useEffect, useState } from 'react';

const AddHabitat = () => {
  const [habitats, setHabitats] = useState([]);
  const [newHabitat, setNewHabitat] = useState({ h_name: '', ecosystem: '' });

  // Fetch habitats when the component mounts
  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        const response = await fetch('http://localhost:5001/habitats');
        if (response.ok) {
          const data = await response.json();
          setHabitats(data);
        } else {
          console.error('Failed to fetch habitats');
        }
      } catch (err) {
        console.error('Error fetching habitats:', err);
      }
    };

    fetchHabitats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newHabitatData = { h_name: newHabitat.h_name, ecosystem: newHabitat.ecosystem };

    try {
      const response = await fetch('http://localhost:5001/habitats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabitatData),
      });

      if (response.ok) {
        const addedHabitat = await response.json();
        setHabitats((prevHabitats) => [...prevHabitats, addedHabitat]);
        setNewHabitat({ h_name: '', ecosystem: '' });
      } else {
        console.error('Failed to add habitat');
      }
    } catch (err) {
      console.error('Error adding habitat:', err);
    }
  };

  // Function to clear the habitat list
  const clearHabitatList = () => {
    setHabitats([]); // Clear the list of habitats
  };

  return (
    <div>
      <h2>Add Habitat</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Habitat Name"
          name="h_name"
          value={newHabitat.h_name}
          onChange={(e) => setNewHabitat({ ...newHabitat, h_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ecosystem"
          name="ecosystem"
          value={newHabitat.ecosystem}
          onChange={(e) => setNewHabitat({ ...newHabitat, ecosystem: e.target.value })}
          required
        />
        <button type="submit">Add Habitat</button>
      </form>

      <h2>Habitats List</h2>
      <button onClick={clearHabitatList} className="clear-btn">Clear List</button>
      <table>
        <thead>
          <tr>
            <th>Habitat Name</th>
            <th>Ecosystem</th>
          </tr>
        </thead>
        <tbody>
          {habitats.map((habitat) => (
            <tr key={habitat._id}>
              <td>{habitat.h_name}</td>
              <td>{habitat.ecosystem}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddHabitat;
