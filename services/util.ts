export const getTodaysDateString = () => {
  return new Date().toISOString().split("T")[0];
};

export const getTomorrowDateString = () => {
  return new Date(+new Date() + 86400000).toISOString().split("T")[0];
};
