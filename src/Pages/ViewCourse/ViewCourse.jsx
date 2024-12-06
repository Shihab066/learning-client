import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const ViewCourse = () => {
    const { courseId } = useParams();
    console.log(courseId);
    return (
        <section className="lg-container flex gap-x-6 px-4 pt-10">
            <div className="w-full">
                <VideoPlayer />
            </div>

            <div className="w-[500px] h-40 bg-red-500">

            </div>
        </section>
    );
};

export default ViewCourse;