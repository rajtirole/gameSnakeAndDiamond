import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const INITIAL_SNAKE = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
  { x: 2, y: 5 },
];
const Direction = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const getRandomCoordinates = () => ({
  x: Math.floor(Math.random() * GRID_WIDTH),
  y: Math.floor(Math.random() * GRID_HEIGHT),
});

const getRandomDirection = (currentDirection) => {
  const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
  const oppositeDirection = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  }[currentDirection];
  const validDirections = directions.filter(direction => direction !== oppositeDirection);
  return validDirections[Math.floor(Math.random() * validDirections.length)];
};

const App = () => {
  const [score, setScore] = useState(0);
  const [dot, setDot] = useState(getRandomCoordinates());
  const [diamond, setDiamond] = useState(getRandomCoordinates());
  const snakes = useRef([INITIAL_SNAKE]);
  const dotPosition = useRef(dot);
  const diamondPosition = useRef(diamond);
  const directions = useRef([Direction.RIGHT]);

  const moveInterval = useRef(null);

  useEffect(() => {
    moveInterval.current = setInterval(moveSnakes, 1000);

    const handleKeyPress = (event) => {
      let newDirection;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = Direction.LEFT;
          break;
        case 'ArrowDown':
          newDirection = Direction.RIGHT;
          break;
        case 'ArrowLeft':
          newDirection = Direction.UP;
          break;
        case 'ArrowRight':
          newDirection = Direction.DOWN;
          break;
        default:
          return;
      }
      moveDot(newDirection);
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(moveInterval.current);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const moveSnakes = () => {
    snakes.current = snakes.current.map((snake, index) => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      head.x += directions.current[index].x;
      head.y += directions.current[index].y;

      if (head.x >= GRID_WIDTH) head.x = 0;
      if (head.x < 0) head.x = GRID_WIDTH - 1;
      if (head.y >= GRID_HEIGHT) head.y = 0;
      if (head.y < 0) head.y = GRID_HEIGHT - 1;

      newSnake.unshift(head);
      newSnake.pop();

      return newSnake;
    });

    checkCollision();
    setDot({ ...dotPosition.current });
    setDiamond({ ...diamondPosition.current });
  };

  const moveDot = (newDirection) => {
    const newDot = { ...dotPosition.current };
    newDot.x += newDirection.x;
    newDot.y += newDirection.y;

    if (newDot.x >= GRID_WIDTH) newDot.x = GRID_WIDTH - 1;
    if (newDot.x < 0) newDot.x = 0;
    if (newDot.y >= GRID_HEIGHT) newDot.y = GRID_HEIGHT - 1;
    if (newDot.y < 0) newDot.y = 0;

    dotPosition.current = newDot;
    checkCollision();
    setDot({ ...newDot });
  };

  const checkCollision = () => {
    snakes.current.forEach((snake) => {
      if (snake.some(segment => segment.x === dotPosition.current.x && segment.y === dotPosition.current.y)) {
        setScore((prev) => prev - 10);
      }
    });

    if (dotPosition.current.x === diamondPosition.current.x && dotPosition.current.y === diamondPosition.current.y) {
      setScore((prev) => prev + 10);
      diamondPosition.current = getRandomCoordinates();
      addRandomMovingSnake();
    }
  };

  const addRandomMovingSnake = () => {
    const newSnake = INITIAL_SNAKE.map(segment => ({ ...segment }));
    snakes.current.push(newSnake);
    directions.current.push(getRandomDirection(Direction.RIGHT));

    const snakeIndex = snakes.current.length - 1;
    const moveNewSnake = () => {
      const newSnake = [...snakes.current[snakeIndex]];
      const head = { ...newSnake[0] };

      head.x += directions.current[snakeIndex].x;
      head.y += directions.current[snakeIndex].y;

      if (head.x >= GRID_WIDTH) head.x = 0;
      if (head.x < 0) head.x = GRID_WIDTH - 1;
      if (head.y >= GRID_HEIGHT) head.y = 0;
      if (head.y < 0) head.y = GRID_HEIGHT - 1;

      newSnake.unshift(head);
      newSnake.pop();

      snakes.current[snakeIndex] = newSnake;
      setTimeout(moveNewSnake, 1000);
    };
    moveNewSnake();
  };

  return (
    <div className="App">
      <h1>Snake Game</h1>
      <div className="grid">
        {[...Array(GRID_HEIGHT)].map((_, y) => (
          <div key={y} className="row">
            {[...Array(GRID_WIDTH)].map((_, x) => (
              <div
                key={x}
                className={`cell ${
                  snakes.current.some(snake => snake.some(cell => cell.x === x && cell.y === y)) ? 'snake' : ''
                } ${dot.x === x && dot.y === y ? 'dot' : ''} ${diamond.x === x && diamond.y === y ? 'diamond' : ''}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div>Score: {score}</div>
    </div>
  );
};

export default App;
