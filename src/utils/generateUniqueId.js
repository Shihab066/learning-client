const generateUniqueId = (length = 4) => {
    const timestamp = Date.now();
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        randomPart += Math.floor(Math.random() * 10);
    }
    return randomPart + timestamp;
};

export default generateUniqueId;