export const getTodaysDateString = () => {
  return new Date().toISOString().split("T")[0];
};
