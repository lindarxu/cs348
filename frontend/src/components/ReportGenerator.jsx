import React, { useEffect, useState } from 'react';

const ReportGenerator = () => {
  const [minCapacity, setMinCapacity] = useState(-1);
  const [maxCapacity, setMaxCapacity] = useState(-1);
  const [selectedAnimal, setSelectedAnimal] = useState('all');
  const [seasonal, setSeasonal] = useState('all');
  const [animals, setAnimals] = useState([]);
  const [reportResults, setReportResults] = useState([]);
  const [averageCapacity, setAverageCapacity] = useState(0);
  const [mostCommonAnimal, setMostCommonAnimal] = useState('');


  // Fetch all animals on load
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('http://localhost:5001/animals');
        const data = await response.json();
        setAnimals(data);
      } catch (err) {
        console.error('Failed to fetch animals:', err.message);
      }
    };

    fetchAnimals();
  }, []);

  // Handle form submission
  /*const handleSubmit = async (e) => {
    e.preventDefault();

    const query = new URLSearchParams({
      minCapacity,
      maxCapacity,
      animal: selectedAnimal,
      seasonal,
    });

    try {
      const response = await fetch(`http://localhost:5001/exhibits/report?${query}`);
      const data = await response.json();
      setReportResults(data);
    } catch (err) {
      console.error('Failed to fetch report:', err.message);
    }
  };*/
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const query = new URLSearchParams({
      minCapacity,
      maxCapacity,
      animal: selectedAnimal,
      seasonal,
    });
  
    try {
      const response = await fetch(`http://localhost:5001/exhibits/report?${query}`);
      const data = await response.json();
      setReportResults(data);
  
      if (data.length > 0) {
        // Calculate average capacity
        const totalCapacity = data.reduce((sum, exhibit) => sum + exhibit.capacity, 0);
        setAverageCapacity((totalCapacity / data.length).toFixed(2));
  
        // Count animal frequencies
        const animalCounts = {};
        data.forEach((exhibit) => {
          const species = exhibit.animal?.species || 'Unknown';
          animalCounts[species] = (animalCounts[species] || 0) + 1;
        });
  
        // Find most common animal
        const mostCommon = Object.entries(animalCounts).reduce((a, b) => (b[1] > a[1] ? b : a));
        setMostCommonAnimal(mostCommon[0]);
      } else {
        setAverageCapacity(0);
        setMostCommonAnimal('');
      }
    } catch (err) {
      console.error('Failed to fetch report:', err.message);
    }
  };
  

  return (
    <div>
      <h2>Exhibit Report Generator</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Min Capacity:</label>
          <input
            type="number"
            value={minCapacity}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Max Capacity:</label>
          <input
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Animal:</label>
          <select value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)}>
            <option value="all">All Animals</option>
            {animals.map((animal) => (
              <option key={animal._id} value={animal._id}>
                {animal.species}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Seasonal:</label>
          <select value={seasonal} onChange={(e) => setSeasonal(e.target.value)}>
            <option value="all">All</option>
            <option value="true">Seasonal</option>
            <option value="false">Non-Seasonal</option>
          </select>
        </div>

        <button type="submit">Generate Report</button>
      </form>

      <h3>Report Results</h3>
      {reportResults.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Animal</th>
              <th>Capacity</th>
              <th>Seasonal</th>
            </tr>
          </thead>
          <tbody>
            {reportResults.map((exhibit) => (
              <tr key={exhibit._id}>
                <td>{exhibit.animal?.species || 'Unknown'}</td>
                <td>{exhibit.capacity}</td>
                <td>{exhibit.seasonal ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {reportResults.length > 0 && (
  <div>
    <p><strong>Average Capacity:</strong> {averageCapacity}</p>
    <p><strong>Most Frequent Animal:</strong> {mostCommonAnimal}</p>
  </div>
)}
    </div>
  );
};

export default ReportGenerator;
