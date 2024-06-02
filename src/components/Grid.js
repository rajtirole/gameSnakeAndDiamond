import React from 'react';
import './Grid.css'

const Grid = () => {
  const rows = 20;
  const columns = 10;

  return (
    <div className="grid-container">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid-row">
          {Array.from({ length: columns }, (_, col) => (
            <div key={`${row}-${col}`} className="grid-cell" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
