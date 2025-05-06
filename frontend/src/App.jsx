import React, { useState, useEffect } from 'react';
import Animal2 from './components/Animal2';
import ExhibitForm from './components/Exhibits'; // Import your ExhibitForm component
import ExhibitTable from './components/ExhibitTable';
import ReportGenerator from './components/ReportGenerator'
const App = () => {
  const [animals, setAnimals] = useState([]);

  // Fetch animals when the component mounts
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:5001/animals');
        if (response.ok) {
          const data = await response.json();
          setAnimals(data); // Update the state with the animals data
        } else {
          console.error('Failed to fetch animals');
        }
      } catch (err) {
        console.error('Error fetching animals:', err);
      }
    };

    fetchAnimals();
  }, []);

  const [exhibits, setExhibits] = useState([]);

  
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
    console.error('Error fetching exhibits:', err.message);
  }
};

useEffect(() => {
  fetchExhibits();
}, []);
  


 /* const [filteredExhibits, setFilteredExhibits] = useState([]);

const handleFilter = async (min, max) => {
  try {
    const query = `min=${min}&max=${max}`;
    const response = await fetch(`http://localhost:5001/api/exhibits/filter?${query}`);
    if (response.ok) {
      const data = await response.json();
      setFilteredExhibits(data);
    } else {
      console.error('Failed to fetch filtered exhibits');
    }
  } catch (err) {
    console.error('Error filtering exhibits:', err);
  }
};*/

  // Function to clear the animal list
  const clearAnimalList = () => {
    setAnimals([]); // Clear the list of animals
  };

  return (
    <div>
      <h1>Welcome to the Personal Zoo Dashboard</h1>

      {/* Pass animals state and clearAnimalList function as props */}
      <Animal2 animals={animals} setAnimals={setAnimals} clearAnimalList={clearAnimalList} />
      {<ExhibitForm animals={animals} fetchExhibits={fetchExhibits} />}
      {<ExhibitTable exhibits={exhibits} />}
      <ReportGenerator/>
    </div>
  );
};

export default App;
