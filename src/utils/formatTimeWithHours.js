const formatTimeWithHours = (duration) => {
  const hours = Math.floor(duration / 3600); // 1 hour = 3600 seconds
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);
  return `${hours} h ${seconds > 30 ? minutes + 1 : minutes} m`;
};

export default formatTimeWithHours;
