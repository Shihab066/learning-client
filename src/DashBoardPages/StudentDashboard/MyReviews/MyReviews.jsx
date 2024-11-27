import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getPendingReviews, getStudentReviews } from "../../../services/reviewsService";
import useAuth from "../../../hooks/useAuth";
import generateImageLink from "../../../utils/generateImageLink";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import { Link, useNavigate } from "react-router-dom";

const MyReviews = () => {
    const [activeLink, setActiveLink] = useState('1');

    return (
        <section className="w-full overflow-hidden">
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
                activeLink === '1' &&
                <PendingReviews />
            }

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
};

const ReviewCard = ({ data }) => {
    const { _courseId, courseName, courseThumbnail, rating, review, date } = data;
    return (
        <div className="group relative flex items-start gap-x-4 border-b pb-3">
            <div className="min-w-[3.5rem] w-14 h-14 bg-base-200 rounded overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                    alt="Course Thumbnail"
                />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
                <Link to={`/course/${_courseId}`} className="leading-5 text-gray-700 font-medium max-w-[85%] truncate">
                    {courseName}
                    {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quos officiis dolorem, esse non assumenda corporis eligendi illo nulla corrupti voluptate ex animi? Recusandae delectus ea iusto sapiente libero explicabo. */}
                </Link>
                <div className="flex items-center gap-x-4">
                    <GenerateDynamicStar rating={rating} />
                    {/* edit */}
                    <button                        
                        className='flex sm:hidden w-fit text-black' title='edit'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5'><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                            <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path></g>
                        </svg>
                    </button>
                </div>
                <p>
                    {review.slice(0)}
                </p>
            </div>

            {/* edit button */}
            <button
                className="hidden sm:flex absolute top-0 right-2 xl:opacity-0 xl:invisible xl:group-hover:opacity-100 xl:group-hover:visible duration-300 " title='edit'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5'><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path></g>
                </svg>
            </button>
        </div>
    )
};

const PendingReviews = () => {
    const { user } = useAuth();
    const { data: pendingReviewsData = [] } = useQuery({
        queryKey: ['pending-reviews'],
        enabled: user !== null,
        queryFn: async () => await getPendingReviews(user.uid)
    });
    console.log(pendingReviewsData);

    return (
        <div className="w-full space-y-4">
            {
                pendingReviewsData?.map((data, index) =>
                    <PendingReviewCard
                        key={index}
                        data={data}
                    />
                )
            }
        </div>
    )
};

const PendingReviewCard = ({ data }) => {
    const { courseId, courseName, courseThumbnail, enrollmentDate, instructorName } = data;
    return (
        <div className="w-full flex items-start gap-x-4 border-b pb-3">
            {/* Thumbnail */}
            <Link
                to={`/course/${courseId}`}
                className="min-w-[3.5rem] w-14 h-14 bg-base-200 rounded overflow-hidden"
            >
                <img
                    className="w-full h-full object-cover"
                    src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                    alt="Course Thumbnail"
                />
            </Link>

            {/* Course Info */}
            <div className="flex-grow overflow-hidden">
                <div className="truncate text-sm sm:text-base font-medium text-gray-700">
                    {courseName}
                    {/* Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab hic autem repellendus perferendis blanditiis at laborum qui animi, reprehenderit harum consequuntur repudiandae unde quas */}
                </div>
                <p className="text-gray-500 text-xs sm:text-sm">{instructorName}</p>
                <button className="flex sm:hidden text-sm text-blue-500">
                    Review
                </button>
            </div>


            {/* Review Button */}
            <div className="hidden sm:flex self-center">
                <button className="text-sm bg-black text-white px-4 py-2 rounded">
                    Review
                </button>
            </div>
        </div>
    );
};

export default MyReviews;