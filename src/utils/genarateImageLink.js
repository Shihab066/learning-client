const genarateImageLink = ({ imageId, width, quality = 100, format = 'auto' }) => {
    return `https://res.cloudinary.com/dg1rgmkkb/image/upload/${width ? `w_${width}/` : ''}q_${quality}/f_${format}/${imageId}`;
}

export default genarateImageLink;