import React, { useState, useEffect } from 'react';
import Grid from './Grid';
import Controls from './Controls';
import Score from './Score';

const GRID_SIZE = { rows: 20, cols: 10 };

const generateRandomPosition = () => ({
  x: Math.floor(Math.random() * GRID_SIZE.cols),
  y: Math.floor(Math.random() * GRID_SIZE.rows)
});

const Game = () => {
  const [snakes, setSnakes] = useState([generateRandomPosition()]);
  const [diamond, setDiamond] = useState(generateRandomPosition());
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSnakes((prevSnakes) => {
          return prevSnakes.map((snake) => {
            const directions = [
              { x: 1, y: 0 },
              { x: -1, y: 0 },
              { x: 0, y: 1 },
              { x: 0, y: -1 }
            ];
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            return {
              x: (snake.x + randomDirection.x + GRID_SIZE.cols) % GRID_SIZE.cols,
              y: (snake.y + randomDirection.y + GRID_SIZE.rows) % GRID_SIZE.rows
            };
          });
        });

        snakes.forEach((snake) => {
          if (snake.x === player.x && snake.y === player.y) {
            setScore((prevScore) => prevScore - 10);
          }

          if (snake.x === diamond.x && snake.y === diamond.y) {
            setDiamond(generateRandomPosition());
            setScore((prevScore) => prevScore + 10);
            setSnakes((prevSnakes) => [...prevSnakes, generateRandomPosition()]);
          }
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning, snakes, player, diamond]);

  const handleDiamondClick = () => {
    setDiamond(generateRandomPosition());
    setScore((prevScore) => prevScore + 10);
    setSnakes([...snakes, generateRandomPosition()]);
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / rect.width * GRID_SIZE.cols);
    const y = Math.floor((e.clientY - rect.top) / rect.height * GRID_SIZE.rows);
    setPlayer({ x, y });
  };

  return (
    <div>
      <Controls
        isRunning={isRunning}
        onStart={() => setIsRunning(true)}
        onStop={() => setIsRunning(false)}
      />
      <Score score={score} />
      <Grid
        size={GRID_SIZE}
        snakes={snakes}
        diamond={diamond}
        player={player}
        onDiamondClick={handleDiamondClick}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
};

export default Game;
