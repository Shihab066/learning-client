const getFirstTwoInitials = (name) => {
    return name
        .split(' ')
        .slice(0, 2) 
        .map(word => word[0].toUpperCase()) 
        .join(''); 
};

export default getFirstTwoInitials;