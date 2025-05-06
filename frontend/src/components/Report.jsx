import React, { useState } from 'react';

const Report = ({ onFilter }) => {
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(Number(minCapacity), Number(maxCapacity));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Min Capacity:
        <input type="number" value={minCapacity} onChange={(e) => setMinCapacity(e.target.value)} />
      </label>
      <label>
        Max Capacity:
        <input type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} />
      </label>
      <button type="submit">Generate Report</button>
    </form>
  );
};

export default Report;
