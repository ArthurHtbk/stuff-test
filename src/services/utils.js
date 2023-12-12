export const generateRandomFood = (num) => {
  return {
    x: Math.floor(Math.random() * num),
    y: Math.floor(Math.random() * num),
  };
};
