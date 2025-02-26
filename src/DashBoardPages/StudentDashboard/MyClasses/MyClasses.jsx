import { useQuery } from "@tanstack/react-query";
import { getEnrollmentCourses } from "../../../services/enrollmentCoursesService";
import useAuth from "../../../hooks/useAuth";
import generateImageLink from "../../../utils/generateImageLink";
import Loading from "../../../components/Loading/Loading";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import dummyCourseThumbnail from '../../../assets/images/dummyCourseThumbnail2.jpg';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import calculatePercentage from "../../../utils/calculatePercentage";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Title from "../../../components/Title/Title";

const MyClasses = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const { data: enrollmentCourses = [], isLoading: isEnrollmentcourseLoading } = useQuery({
        queryKey: ['myClasses', user],
        enabled: user !== null,
        queryFn: () => getEnrollmentCourses(axiosSecure, user.uid)
    });

    console.log(enrollmentCourses);

    return (
        <section className="lg-container min-h-[25rem] my-10 px-3 md:px-4 xl:px-6">
            <Title title={'My Classes'}/>
            <div>
                <h2 className="text-2xl font-medium mb-3">My Classes</h2>
                <hr />
            </div>

            {/* enrollment courses */}
            {
                isEnrollmentcourseLoading
                    ?
                    <Loading />
                    :
                    enrollmentCourses.length > 0
                        ?
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                            {
                                enrollmentCourses.map((courseData, index) =>
                                    <MyClassCard
                                        key={index}
                                        courseData={courseData}
                                    />
                                )
                            }
                        </div>
                        :
                        <EmptyPage
                            text="It looks like you haven't enrolled in any courses yet"
                            btn={true}
                            btnText="Start learning something new today!"
                        />
            }
        </section>
    );
};

const MyClassCard = ({ courseData }) => {
    const { courseId, courseName, courseThumbnail, instructorName, totalLecturesWatched, totalVideos } = courseData;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 50) + '...' : courseName;
    const courseCompletePercent = calculatePercentage(totalVideos, totalLecturesWatched);

    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const handleImageLoad = () => {
        setIsLoaded(true); // Mark the image as loaded
    };
    return (
        <div className="w-full h-fit border border-[#E2E8F0] rounded-xl overflow-hidden">
            <img
                src={dummyCourseThumbnail}
                alt="Placeholder"
                id="dummy"
                className={`${isLoaded ? 'hidden' : 'block'}`}
            />
            <img
                className={`w-full object-cover ${isLoaded ? 'block' : 'hidden'}`}
                src={generateImageLink({ imageId: courseThumbnail, width: '400', height: '225', cropMode: 'fill', aspactRatio: '16:9' })}
                alt="course thumbnail"
                onLoad={handleImageLoad}
            />
            <div className='p-3 lg:p-4 space-y-2'>
                <h3 className="h-12 lg:h-14 text-base lg:text-lg font-medium" title={courseName}>
                    {modifiedCourseName}
                </h3>
                <p className="truncate">
                    By {instructorName}
                </p>
                <div className="w-full h-2.5 border rounded-full overflow-hidden">
                    <div style={{ width: `${courseCompletePercent ? `${courseCompletePercent}%` : '0'}` }} className={`h-full rounded-full bg-blue-500`}></div>
                </div>
                {
                    courseCompletePercent > 0
                        ?
                        <p className="font-medium">
                            {courseCompletePercent}% Complete
                        </p>
                        :
                        <p className="h-6"></p>
                }

                <button onClick={() => navigate(`/course/view/${courseId}`)} className="btn w-full normal-case bg-black hover:bg-black hover:bg-opacity-80 duration-300 text-white py-2 rounded-md">
                    {
                        totalLecturesWatched === 0
                            ?
                            'Start Course'
                            :
                            'Continue Learning'
                    }
                </button>
            </div>
        </div>
    )
}

export default MyClasses;