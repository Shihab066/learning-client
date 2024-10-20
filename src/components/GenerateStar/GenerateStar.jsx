// this component take prop fill(hexValue of color) and return a star with fill color
const GenerateStar = ({ fill }) => (
    <svg className="w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={fill} />
    </svg>
);

export default GenerateStar;