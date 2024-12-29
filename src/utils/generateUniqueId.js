const generateUniqueId = (length = 3) => {
    const timestamp = Date.now().toString().slice(-5);
    let randomPart = '';
    for (let i = 0; i < length; i++) {
        randomPart += Math.floor(Math.random() * 10);
    }
    return randomPart + timestamp;
};

export default generateUniqueId;