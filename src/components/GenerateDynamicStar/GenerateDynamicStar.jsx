import { useEffect } from "react";
import { useState } from "react";

const GenerateDynamicStar = ({rating}) => {
    const [starTypes, setStarTypes] = useState([]);

    // Calculate the star rating array (full stars, half stars, and empty stars)
    useEffect(() => {
        let newRating = rating;
        const ratingsArr = [];
        for (let i = 0; i < 5; i++) {
            if (newRating > 0 && newRating < 1) {
                ratingsArr.push(parseFloat(newRating.toFixed(1))); // For half-star
                newRating -= newRating;
            } else if (newRating > 0) {
                ratingsArr.push(1); // Full star
                newRating -= 1;
            } else {
                ratingsArr.push(0); // Empty star
            }
        }
        setStarTypes(ratingsArr);
    }, [rating]);
    return (
        <div className="flex">
            {starTypes.map((starType, index) => <Star key={index} starType={starType} />)}
        </div>
    );
};

// Star Component: Displays full, half, or empty stars
const Star = ({ starType }) => {
    return (
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            {starType === 1 && (
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill="#FEC84B"
                />

            )}
            {starType > 0 && starType < 1 && (
                <defs>
                    <linearGradient id={`grad-${starType}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${starType * 100}%`} stopColor="#FEC84B" />
                        <stop offset={`${starType * 100}%`} stopColor="#CBD5E1" />
                    </linearGradient>
                </defs>
            )}
            {starType > 0 && starType < 1 && (
                <path fill={`url(#grad-${starType})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            )}
            {starType === 0 && (
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill="#CBD5E1"
                />
            )}
        </svg>
    );
}
export default GenerateDynamicStar;