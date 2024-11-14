// Function to format timestamp into readable date
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = String(date.getDate()).padStart(2, '0');
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${monthName} ${day}, ${year}`;
};

export default formatDate;