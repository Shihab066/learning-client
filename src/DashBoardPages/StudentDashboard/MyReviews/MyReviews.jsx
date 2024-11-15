import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getStudentReviews } from "../../../services/reviewsService";
import useAuth from "../../../hooks/useAuth";
import generateImageLink from "../../../utils/generateImageLink";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import { Link } from "react-router-dom";

const MyReviews = () => {
    const [activeLink, setActiveLink] = useState('1');

    return (
        <section>
            <div>
                <h2 className="text-xl font-medium">
                    My Reviews
                </h2>
            </div>

            <div className="my-6 pb-3 border-b flex justify-start gap-x-6">
                <button onClick={() => setActiveLink('1')} className="group text-gray-500 font-medium">
                    To Be Reviewed
                    <div className={`${activeLink === '1' ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                </button>

                <button onClick={() => setActiveLink('2')} className="group text-gray-500 font-medium">
                    History
                    <div className={`${activeLink === '2' ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                </button>
            </div>

            {
                activeLink === '2' &&
                <MyReviewHistory />
            }


        </section>
    );
};

const MyReviewHistory = () => {
    const { user } = useAuth();
    const { data: myReviewsData = [] } = useQuery({
        queryKey: ['my-reviews'],
        enabled: user !== null,
        queryFn: async () => await getStudentReviews(user.uid)
    });

    return (
        <div className="flex flex-col gap-y-6">
            {
                myReviewsData?.map((data, index) =>
                    <ReviewCard
                        key={index}
                        data={data}
                    />
                )
            }
        </div>
    )
}

const ReviewCard = ({ data }) => {
    const { _courseId, courseName, courseThumbnail, rating, review, date } = data;
    return (
        <div className="group relative flex items-start gap-x-4 border-b pb-3">
            <img
                className="w-14 h-14 rounded object-cover"
                src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                alt="Course Thumbnail"
            />
            <div className="flex flex-col gap-y-2">
                <Link to={`/course/${_courseId}`} className="leading-5 text-gray-700 font-medium max-w-[50rem] truncate">
                    {courseName}
                </Link>
                <GenerateDynamicStar rating={rating} />
                <p>
                    {review.slice(0)}
                </p>
            </div>

            {/* edit button */}
            <button
                className="absolute top-0 right-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300 " title='edit'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5'><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path></g>
                </svg>
            </button>
        </div>
    )
};
export default MyReviews;