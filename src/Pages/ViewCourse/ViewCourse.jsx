import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/baseAPI";
import { useEffect, useRef, useState } from "react";
import formatTimeWithHours from "../../utils/formatTimeWithHours";
import formatTimeWithMin from "../../utils/formatTimeWithMin";
import { getEnrollmentCourseContents, updateLearingProgress } from "../../services/enrollmentCoursesService";
import useAuth from "../../hooks/useAuth";
import CourseCompleteAnimation from "./CourseCompleteAnimation";

const ViewCourse = () => {
    const { courseId } = useParams();
    const { user } = useAuth();

    const { data = {} } = useQuery({
        queryKey: ['course-contents', courseId],
        // enabled: !!user,
        queryFn: async () => await getEnrollmentCourseContents("fs", courseId)
    });
    // console.log(data);

    const [videoIds, setVideoIds] = useState([]);
    const [totalVideoWatched, setTotalVideoWatched] = useState([]);
    const [milestoneId, setMilestoneId] = useState('');
    const [videoId, setVideoId] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [isExpandView, setExpandView] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(null);
    const [autoPlay, setAutoPlay] = useState(false);
    const activeItemRef = useRef();
    const containerRef = useRef();
    const navigate = useNavigate();
    const effect = useRef(true);

    useEffect(() => {
        if (currentProgress && (currentProgress < 100)) {
            setAutoPlay(true)
        }
    }, [currentProgress])

    useEffect(() => {
        if (data?.currentProgress?.totalLecturesWatched === 0 && effect.current && videoIds) {
            setVideoId(videoIds[0]);
            effect.current = false;
        }
        else if (totalVideoWatched?.length && effect.current) {
            setVideoId(totalVideoWatched[totalVideoWatched.length - 1]);
            effect.current = false
        }
    }, [totalVideoWatched, data, videoIds]);

    useEffect(() => {
        const allVideoIds = data?.contents?.courseContents.flatMap(milestones =>
            milestones.milestoneModules.flatMap(milestoneModule =>
                milestoneModule.moduleItems.map(moduleItem => moduleItem.itemData)
            )
        );
        setVideoIds(allVideoIds);
    }, [data]);

    useEffect(() => {
        setTotalVideoWatched(videoIds?.slice(0, data?.currentProgress?.totalLecturesWatched));
    }, [videoIds, data])

    useEffect(() => {
        if (containerRef.current && activeItemRef.current) {
            const container = containerRef.current;
            const item = activeItemRef.current;

            // Calculate the position of the item relative to the container
            const containerTop = container.getBoundingClientRect().top;
            const itemTop = item.getBoundingClientRect().top;

            // Adjust the container's scroll position
            container.scrollTop += itemTop - containerTop;
        }
    }, [milestoneId, data]);

    const handlePrevButton = () => {
        const prevVideoIndex = videoIds.indexOf(videoId) - 1;
        if (prevVideoIndex >= 0) {
            setVideoId(videoIds[prevVideoIndex]);
        }
    };

    const handleNextButton = () => {
        const currentVideoIndex = videoIds.indexOf(videoId);
        const nextVideoIndex = videoIds.indexOf(videoId) + 1;
        if (nextVideoIndex < videoIds.length) {
            setVideoId(videoIds[nextVideoIndex]);
        }
        if (!totalVideoWatched?.includes(videoIds[currentVideoIndex])) {
            setTotalVideoWatched([...totalVideoWatched, videoIds[currentVideoIndex]]);
        }
    };

    const handleExpandView = () => {
        setExpandView(!isExpandView);
    };

    useEffect(() => {
        if (videoIds?.length && totalVideoWatched?.length) {
            const progress = (totalVideoWatched.length / videoIds.length) * 100;
            setCurrentProgress(parseInt(progress))
        }
    }, [videoIds, totalVideoWatched]);

    useEffect(() => {
        if ((totalVideoWatched?.length > data?.currentProgress?.totalLecturesWatched) || (currentProgress > data?.currentProgress?.courseCompletePercent)) {
            const updateDoc = {
                totalVideoWatched: totalVideoWatched.length,
                currentProgress
            }
            console.log(updateDoc);

            updateLearingProgress(user.uid, courseId, updateDoc)
        }
    }, [totalVideoWatched, currentProgress]);

    const radialProgressStyle = {
        background: `conic-gradient(#a855f7 ${currentProgress || 0}%, #e0e0e0 ${currentProgress || 0}% 100%)`,
    };

    return (
        <>
            <section className="lg-container px-4 pt-8">
                <div className="border-b pb-4 flex items-center gap-x-10">
                    {/* Back Button and Video Title */}
                    <div className="flex items-center gap-x-2 flex-grow">
                        <button
                            onClick={() => navigate('/my-classes')}
                            className="bg-black p-1 rounded-full"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={15}
                                height={15}
                                viewBox="0 0 12 12"
                            >
                                <path
                                    fill="#fff"
                                    d="M10.5 6a.75.75 0 0 0-.75-.75H3.81l1.97-1.97a.75.75 0 0 0-1.06-1.06L1.47 5.47a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 0 0 1.06-1.06L3.81 6.75h5.94A.75.75 0 0 0 10.5 6"
                                ></path>
                            </svg>
                        </button>
                        <h3 className="text-xl font-medium leading-[24px] text-gray-700">
                            {videoTitle}
                        </h3>
                    </div>

                    {/* Progress and Tooltip Section */}
                    <div className="relative group">
                        {/* Progress Circle */}
                        <div
                            className="relative flex items-center justify-center min-w-fit h-fit p-[3px] bgp rounded-full overflow-hidden"
                            style={radialProgressStyle}
                        >
                            <div className="flex items-center justify-center w-12 h-12 text-xl font-bold bg-white rounded-full">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 text-gray-500"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M7 21v-2h4v-3.1q-1.225-.275-2.187-1.037T7.4 12.95q-1.875-.225-3.137-1.637T3 8V7q0-.825.588-1.412T5 5h2V3h10v2h2q.825 0 1.413.588T21 7v1q0 1.9-1.263 3.313T16.6 12.95q-.45 1.15-1.412 1.913T13 15.9V19h4v2zm0-10.2V7H5v1q0 .95.55 1.713T7 10.8m5 3.2q1.25 0 2.125-.875T15 11V5H9v6q0 1.25.875 2.125T12 14m5-3.2q.9-.325 1.45-1.088T19 8V7h-2zm-5-1.3"
                                    ></path>
                                </svg>
                            </div>
                        </div>

                        {/* Tooltip Arrow */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute w-6 text-gray-500 top-full right-1/2 translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300 z-[999]"
                            viewBox="0 0 64 64"
                        >
                            <path
                                fill="#fff"
                                stroke="currentColor"
                                d="M32 2L2 62h60z"
                            ></path>
                        </svg>

                        {/* Tooltip Background */}
                        <div
                            className="absolute w-6 h-2 bg-white top-full mt-[17px] right-1/2 translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300 z-[999]"
                        ></div>

                        {/* Tooltip Content */}
                        <div
                            className="absolute top-full -right-4 mt-4 w-[20rem] h-fit p-6 space-y-3 border bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300 z-[998]"
                        >
                            <h3 className="font-bold">
                                {totalVideoWatched?.length} of {videoIds?.length} complete.
                            </h3>
                            <p className="text-[15px]">
                                Finish course to get your certificate
                            </p>
                        </div>
                    </div>
                </div>
                <div className={`flex ${isExpandView ? 'flex-col' : 'flex-col lg:flex-row'} gap-6 pt-6`}>
                    {/* Main Content Area */}
                    <div className="flex-grow">
                        {/* Video Player */}
                        {
                            videoId &&
                            <VideoPlayer
                                key={autoPlay}
                                videoIds={videoIds}
                                videoId={videoId}
                                setVideoId={setVideoId}
                                handleNextButton={handleNextButton}
                                handlePrevButton={handlePrevButton}
                                handleExpandView={handleExpandView}
                                autoPlay={autoPlay}
                            />
                        }

                        {/* Navigation Buttons */}
                        {videoIds?.length > 0 && (
                            <div className="flex justify-end gap-x-4 mt-6 select-none">
                                {videoIds?.indexOf(videoId) > 0 && (
                                    <button
                                        onClick={handlePrevButton}
                                        className="px-4 py-2 font-bold text-black bg-white border border-black rounded-md hover:bg-base-300"
                                    >
                                        Previous
                                    </button>
                                )}
                                {videoIds?.indexOf(videoId) < videoIds.length - 1 && (
                                    <button
                                        onClick={handleNextButton}
                                        className="px-8 py-2 font-bold text-white bg-black border border-black rounded-md hover:bg-opacity-80"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Video Description */}
                        {videoDescription && (
                            <div>
                                <h4 className="pb-2 font-medium border-b">Video Description</h4>
                                <div className="max-h-56 mt-4 bg-white rounded-md overflow-y-auto md-scrollbar">
                                    {videoDescription}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Content */}
                    <div
                        ref={containerRef}
                        className={`w-full lg:w-[350px] ${isExpandView ? 'xl:w-full' : 'xl:min-w-[450px]'} h-screen max-h-[750px] overflow-auto bg-white space-y-4 pb-10 border rounded-xl px-2 py-4 scroll-smooth select-none`}
                    >
                        {data?.contents?.courseContents?.map((content, index) => (
                            <ContentCard
                                key={index}
                                data={content}
                                videoId={videoId}
                                setVideoId={setVideoId}
                                milestoneId={milestoneId}
                                setMilestoneId={setMilestoneId}
                                activeItemRef={activeItemRef}
                                setVideoDescription={setVideoDescription}
                                setVideoTitle={setVideoTitle}
                                totalVideoWatched={totalVideoWatched}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {
                currentProgress === 100 &&
                <CourseCompleteAnimation
                    setAutoPlay={setAutoPlay}
                />
            }
        </>
    );
};

const ContentCard = ({ data, videoId, setVideoId, milestoneId, setMilestoneId, activeItemRef, setVideoDescription, setVideoTitle, totalVideoWatched }) => {
    const { _id, milestoneName, milestoneModules } = data;
    const reduceCurrentItem = (moduleItems) => {
        const modulesDuration = moduleItems.reduce((acc, curr) => acc + (curr?.duration || 0), 0);
        return modulesDuration;
    }
    const milestoneDurationInSec = milestoneModules.reduce((acc, curr) => acc + reduceCurrentItem(curr.moduleItems), 0);
    const milestoneDurationInHours = formatTimeWithHours(milestoneDurationInSec);
    const milestoneVideoCount = milestoneModules.reduce((acc, curr) => acc + curr.moduleItems.length, 0);
    const totalWatched = milestoneModules.flatMap(item => item.moduleItems.filter(item => totalVideoWatched?.includes(item.itemData))).length;

    const milestoneRef = useRef();
    useEffect(() => {
        if (milestoneId === _id) {
            milestoneRef.current.checked = true;
        } else {
            milestoneRef.current.checked = false;
        }
    }, [milestoneId, _id, videoId]);


    return (
        <div ref={milestoneId === _id ? activeItemRef : null} className="collapse collapse-custom bg-white border rounded-lg ">
            <input ref={milestoneRef} type="checkbox" name="my-accordion-3" />

            {/* Milestone Name */}
            <div className="collapse-title collapse-custom-icon text-lg font-medium relative">
                {milestoneName}
                <div className="text-sm text-gray-500 font-normal flex items-center gap-x-2.5">
                    <div className="flex items-center">
                        {milestoneDurationInHours}
                        <div className="font-extrabold text-xl leading-5 pb-2 ml-1">.</div>
                    </div>
                    <div>
                        {totalWatched}/{milestoneVideoCount}
                    </div>

                </div>
            </div>

            {/* Milestone Modules */}
            <div className="collapse-content space-y-4">
                {
                    milestoneModules?.map((milestoneModule, index) =>
                        <MilestoneModule
                            key={index}
                            milestoneId={_id}
                            milestoneModule={milestoneModule}
                            videoId={videoId}
                            setVideoId={setVideoId}
                            setMilestoneId={setMilestoneId}
                            setVideoDescription={setVideoDescription}
                            setVideoTitle={setVideoTitle}
                            totalVideoWatched={totalVideoWatched}
                        />
                    )
                }
            </div>
        </div>
    )
}

const MilestoneModule = ({ milestoneId, milestoneModule, videoId, setVideoId, setMilestoneId, setVideoDescription, setVideoTitle, totalVideoWatched }) => {
    const { moduleName, moduleItems } = milestoneModule;
    const totalModuleTimeInSec = moduleItems.reduce((acc, curr) => acc + (curr?.duration || 0), 0);
    const totalModuleDuration = formatTimeWithHours(totalModuleTimeInSec)
    const modulesVideoCount = moduleItems.length;
    const totalWatched = moduleItems.filter(item => totalVideoWatched?.includes(item.itemData)).length;

    const moduleRef = useRef();

    useEffect(() => {
        const isVideoExist = moduleItems?.find(moduleData => moduleData.itemData === videoId);
        if (isVideoExist) {
            moduleRef.current.checked = true;
            setMilestoneId(milestoneId);
        } else {
            moduleRef.current.checked = false;
        }
    }, [videoId])
    return (
        <div className="collapse collapse-arrow bg-[#f7f9fa] rounded-lg">
            <input ref={moduleRef} type="checkbox" name="my-accordion-2" />
            {/* Module Name */}
            <div className="collapse-title font-medium">
                {moduleName}
                <div className="text-sm text-gray-500 font-normal flex items-center gap-x-2.5">
                    <div className="flex items-center">
                        {totalModuleDuration}
                        <div className="font-extrabold text-xl leading-5 pb-2 ml-1">.</div>
                    </div>
                    <div>
                        {totalWatched}/{modulesVideoCount}
                    </div>

                </div>
            </div>

            {/* Modules Items */}
            <div className="collapse-content space-y-2">
                {
                    moduleItems?.map((moduleData, index) =>
                        <ModuleItem
                            key={index}
                            moduleData={moduleData}
                            videoId={videoId}
                            setVideoId={setVideoId}
                            setVideoDescription={setVideoDescription}
                            setVideoTitle={setVideoTitle}
                            watched={totalVideoWatched?.includes(moduleData.itemData)}
                        />
                    )
                }
            </div>
        </div>
    )
};

const ModuleItem = ({ moduleData, videoId, setVideoId, setVideoDescription, setVideoTitle, watched }) => {
    const { itemType, itemName, itemData, itemDescription, duration } = moduleData;
    const videoDuration = formatTimeWithMin(duration)

    if (itemData === videoId) {
        setVideoTitle(itemName);
        setVideoDescription(itemDescription);
    }
    return (
        <div onClick={() => setVideoId(itemData)}>
            <div onClick={(e) => { if (!watched) e.stopPropagation() }} className={`flex gap-x-2 text-sm px-2 py-3 rounded-md cursor-pointer ${videoId === itemData ? 'text-white bg-black' : 'bg-slate-200 text-black'}`}>
                <div>
                    {
                        videoId === itemData ?
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6" viewBox="0 0 16 16"><path fill="#fff" fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1m3.901 7L6 4.066v7.868z" clipRule="evenodd"></path></svg>
                            :
                            watched ?
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6" viewBox="0 0 1024 1024"><path fill="#16a34a" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896m-55.808 536.384l-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"></path></svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 text-gray-500" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><rect width={18} height={11} x={3} y={11} rx={2} ry={2}></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></g></svg>
                    }
                </div>
                <div className="font-medium">
                    {itemName}
                    <div className={`flex items-center gap-x-2 mt-2 font-normal ${videoId === itemData ? 'text-white' : 'text-gray-500'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`w-6`} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.5} d="M22.54 6.42a2.77 2.77 0 0 0-1.945-1.957C18.88 4 12 4 12 4s-6.88 0-8.595.463A2.77 2.77 0 0 0 1.46 6.42C1 8.148 1 11.75 1 11.75s0 3.602.46 5.33a2.77 2.77 0 0 0 1.945 1.958C5.121 19.5 12 19.5 12 19.5s6.88 0 8.595-.462a2.77 2.77 0 0 0 1.945-1.958c.46-1.726.46-5.33.46-5.33s0-3.602-.46-5.33ZM9.75 15.021V8.48l5.75 3.271z"></path></svg>
                        {videoDuration}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ViewCourse;