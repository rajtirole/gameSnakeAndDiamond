import React from 'react';

const Controls = ({ isRunning, onStart, onStop }) => {
  return (
    <div>
      {isRunning ? (
        <button onClick={onStop}>Stop</button>
      ) : (
        <button onClick={onStart}>Start</button>
      )}
    </div>
  );
};

export default Controls;
