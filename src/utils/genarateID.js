
const generateMongoId = () => {
    const timestamp = Math.floor(Date.now() / 1000).toString(16);
    const randomValue = Math.random().toString(16).substr(2, 10);
    const counter = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  
    return timestamp + randomValue + counter;
}

export default generateMongoId;