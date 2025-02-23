const generateImageLink = (props) => {
    const { imageId, width, height, aspectRatio, cropMode, quality = 100, format = 'auto' } = props;
    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUD_NAME}/image/upload/${aspectRatio ? `ar_${aspectRatio},` : ''}${cropMode ? `c_${cropMode},` : ''}${width ? `w_${width},` : ''}${height ? `h_${height},` : ''}q_${quality}/f_${format}/${imageId}`;
}

export default generateImageLink;