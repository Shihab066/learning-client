function formateCourseDuration(seconds) {
    if (seconds < 3600) { // Less than 1 hour
        let minutes = Math.floor(seconds / 60);
        return `${minutes} total minutes`;
    } else { // 1 hour or more
        let hours = seconds / 3600;
        return hours % 1 === 0 ? `${hours} total hours` : `${hours.toFixed(1)} total hours`;
    }
}

export default formateCourseDuration;