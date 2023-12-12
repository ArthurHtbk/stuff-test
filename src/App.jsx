import React, { useState, useEffect, useRef } from "react";
import { games } from "./services/games";
import { generateRandomFood } from "./services/utils";

const { gridSize, cellSize, defaultDirection, defaultPosition } = games.snake;

const App = () => {
  const [snake, setSnake] = useState(defaultPosition);
  const [direction, setDirection] = useState(defaultDirection);
  const [food, setFood] = useState(generateRandomFood(gridSize));
  const [gameOver, setGameOver] = useState(false);

  const gameRef = useRef();

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection("UP");
          break;
        case "ArrowDown":
          setDirection("DOWN");
          break;
        case "ArrowLeft":
          setDirection("LEFT");
          break;
        case "ArrowRight":
          setDirection("RIGHT");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const updateGame = () => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y = (head.y - 1 + gridSize) % gridSize;
            break;
          case "DOWN":
            head.y = (head.y + 1) % gridSize;
            break;
          case "LEFT":
            head.x = (head.x - 1 + gridSize) % gridSize;
            break;
          case "RIGHT":
            head.x = (head.x + 1) % gridSize;
            break;
          default:
            break;
        }

        newSnake.unshift(head);

        if (
          newSnake.some(
            (segment, index) =>
              index !== 0 && segment.x === head.x && segment.y === head.y
          ) ||
          head.x < 0 ||
          head.x >= gridSize ||
          head.y < 0 ||
          head.y >= gridSize
        ) {
          setGameOver(true);
          return;
        }

        if (head.x === food.x && head.y === food.y) {
          setFood(generateRandomFood(gridSize));
        } else {
          newSnake.pop();
        }

        setSnake(newSnake);
      };

      const gameLoop = setInterval(updateGame, 200);

      gameRef.current = gameLoop;

      return () => {
        clearInterval(gameLoop);
      };
    }
  }, [direction, snake, food, gameOver]);

  const resetGame = () => {
    setSnake(defaultPosition);
    setDirection(defaultDirection);
    setFood(generateRandomFood(gridSize));
    setGameOver(false);
  };

  useEffect(() => {
    if (gameOver) {
      document.addEventListener("keydown", resetGame);
    }

    return () => {
      document.removeEventListener("keydown", resetGame);
    };
  }, [gameOver]);

  return (
    <div>
      {gameOver && <div>Game Over! Press any key to restart.</div>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const x = index % gridSize;
          const y = Math.floor(index / gridSize);

          const isSnake = snake.some(
            (segment) => segment.x === x && segment.y === y
          );
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: isSnake
                  ? "green"
                  : isFood
                  ? "red"
                  : "lightgray",
                border: "1px solid white",
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
