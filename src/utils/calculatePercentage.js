const calculatePercentage = (totalVideos, completedVideos) => {
    if (totalVideos <= 0) {
        return 0;
    }
    const percentage = (completedVideos / totalVideos) * 100;
    return percentage;
}

export default calculatePercentage;