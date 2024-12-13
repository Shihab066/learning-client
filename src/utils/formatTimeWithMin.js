const formatTimeWithMin = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${seconds > 30 ? minutes + 1 : minutes} min`;
};

export default formatTimeWithMin;
