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
  // Remove the opposite direction to prevent the snake from reversing directly
  const oppositeDirection = {
    [Direction.UP]: Direction.DOWN,
    [Direction.DOWN]: Direction.UP,
    [Direction.LEFT]: Direction.RIGHT,
    [Direction.RIGHT]: Direction.LEFT,
  }[currentDirection];
  const validDirections = directions.filter(direction => direction !== oppositeDirection);
  return validDirections[Math.floor(Math.random() * validDirections.length)];
};

const getRandomInterval = () => Math.floor(Math.random() * 8000) + 1000; // Between 1 and 8 seconds

const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(Direction.RIGHT);
  const directionRef = useRef(direction);
  const [dot, setDot] = useState(getRandomCoordinates());
  const [diamond, setDiamond] = useState(getRandomCoordinates());
  const [score, setScore] = useState(0);
  let diamondnew=diamond
  let newdot=dot
let snakenew=snake

  useEffect(() => {
    const moveInterval = setInterval(moveSnake, 1000); // Snake moves every 1 second
    changeDirectionRandomly();
    
    return () => {
      clearInterval(moveInterval);
    };
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowLeft' :
          moveDot(Direction.UP);
          break;
        case 'ArrowRight':
          moveDot(Direction.DOWN);
          break;
        case 'ArrowUp':
          moveDot(Direction.LEFT);
          break;
        case 'ArrowDown':
          moveDot(Direction.RIGHT);
          break;
        default:
          break;
      }
    };
  
    document.addEventListener('keydown', handleKeyPress);
  
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Only add event listener once when component mounts
  
  const changeDirectionRandomly = () => {
    setTimeout(() => {
      setDirection(getRandomDirection(directionRef.current));
      changeDirectionRandomly();
    }, getRandomInterval());
  };

  const moveSnake = () => {
    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      head.x += directionRef.current.x;
      head.y += directionRef.current.y;

      // Wrap around the grid edges
      if (head.x >= GRID_WIDTH) head.x = 0;
      if (head.x < 0) head.x = GRID_WIDTH - 1;
      if (head.y >= GRID_HEIGHT) head.y = 0;
      if (head.y < 0) head.y = GRID_HEIGHT - 1;

      newSnake.unshift(head);
      newSnake.pop();
      snakenew=newSnake
      return newSnake;
    });
   console.log('daimond',diamondnew);
   console.log('snake',snakenew[0]);
   console.log('dot',newdot);



    checkCollision();
  };

  const moveDot = (newDirection) => {
    setDot((prevDot) => {
      const newDot = { ...prevDot };
      newDot.x += newDirection.x;
      newDot.y += newDirection.y;
  
      // Ensure the dot stays within the grid bounds
      if (newDot.x >= GRID_WIDTH) newDot.x = GRID_WIDTH - 1;
      if (newDot.x < 0) newDot.x = 0;
      if (newDot.y >= GRID_HEIGHT) newDot.y = GRID_HEIGHT - 1;
      if (newDot.y < 0) newDot.y = 0;
      
      if (newDot.x === diamond.x && newDot.y === diamond.y||(newDot.x === diamondnew.x && newDot.y === diamondnew.y)) {
        // Increase score and set new diamond position
        setScore((prev)=>{
          return prev+10
        });
        let a=getRandomCoordinates()
        diamondnew=a
        setDiamond(a);
      }
      newdot=newDot
      checkCollision()
    
  
      return newDot;
    });
  
    // checkCollision(); // Check for collision after updating dot position
  };
  

    const checkCollision = () => {
        // Check collision between green dot and diamond
        if (newdot.x === snakenew[0].x && newdot.y === snakenew[0].y||newdot.x === snakenew[1].x && newdot.y === snakenew[1].y||newdot.x === snakenew[2].x && newdot.y === snakenew[2].y||newdot.x === snakenew[3].x && newdot.y === snakenew[3].y) {
          console.log('afsdfasd',newdot,snakenew[0]);
          // Increase score and set new diamond position
          setScore((prev)=>{
            return prev-10
          });
          let a=getRandomCoordinates()
          diamondnew=a
          setDiamond(a);
        }
      
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
                  snake.some((cell) => cell.x === x && cell.y === y) ? 'snake' : ''
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
