import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/baseAPI";
import { useEffect, useRef, useState } from "react";
import formatTimeWithHours from "../../utils/formatTimeWithHours";
import formatTimeWithMin from "../../utils/formatTimeWithMin";

const ViewCourse = () => {
    const { courseId } = useParams();

    const { data = {} } = useQuery({
        queryKey: ['course-contents'],
        queryFn: async () => {
            const res = await api.get(`/course/content/fs/${courseId}`);
            return res.data;
        }
    });
    console.log(data);

    const [videoIds, setVideoIds] = useState([]);
    const [totalVideoWatched, setTotalVideoWatched] = useState([]);
    const [milestoneId, setMilestoneId] = useState('');
    const [videoId, setVideoId] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [isExpandView, setExpandView] = useState(false);
    const activeItemRef = useRef();
    const containerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        setMilestoneId("67529190d5c9fb13e22175a6");
        setVideoId("wgs3rcdhgngvd2rei3pw");
    }, [])

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
    
    console.log(totalVideoWatched);
    


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
        const nextVideoIndex = videoIds.indexOf(videoId) + 1;
        if (nextVideoIndex < videoIds.length) {
            setVideoId(videoIds[nextVideoIndex]);
        }
    };

    const handleExpandView = () => {
        setExpandView(!isExpandView);
    };

    return (
        <section className="lg-container px-4 pt-8">
            <div className="border-b pb-4 flex items-center gap-x-2">
                <button onClick={() => navigate('/my-classes')} className="bg-black rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} viewBox="0 0 12 12"><path fill="#fff" d="M10.5 6a.75.75 0 0 0-.75-.75H3.81l1.97-1.97a.75.75 0 0 0-1.06-1.06L1.47 5.47a.75.75 0 0 0 0 1.06l3.25 3.25a.75.75 0 0 0 1.06-1.06L3.81 6.75h5.94A.75.75 0 0 0 10.5 6"></path></svg>
                </button>
                <h3 className="text-xl leading-[24px] font-medium text-gray-700">
                    {videoTitle}
                </h3>
            </div>
            <div className={`flex ${isExpandView ? 'flex-col' : 'flex-col lg:flex-row'} gap-6 pt-6`}>
                <div className="flex-grow">
                    <VideoPlayer
                        videoIds={videoIds}
                        videoId={videoId}
                        setVideoId={setVideoId}
                        handleNextButton={handleNextButton}
                        handlePrevButton={handlePrevButton}
                        isExpandView={isExpandView}
                        handleExpandView={handleExpandView}
                    />

                    {
                        videoIds?.length > 0 &&
                        <div className="flex gap-x-4 mt-6 justify-end select-none">
                            {
                                videoIds?.indexOf(videoId) > 0 &&
                                <button onClick={handlePrevButton} className="bg-white hover:bg-base-300 text-black border border-black rounded-md px-4 py-2 font-bold">
                                    Previous
                                </button>
                            }
                            {
                                videoIds?.indexOf(videoId) < videoIds.length - 1 &&
                                <button onClick={handleNextButton} className="bg-black hover:bg-opacity-80 text-white border border-black rounded-md px-8 py-2 font-bold">
                                    Next
                                </button>
                            }
                        </div>
                    }

                    {
                        videoDescription &&
                        <div>
                            <h4 className="font-medium border-b pb-2">
                                Video Description
                            </h4>
                            <div className="mt-4 bg-white max-h-56 rounded-md overflow-y-auto md-scrollbar">
                                {videoDescription}
                            </div>
                        </div>
                    }
                </div>

                <div ref={containerRef} className={`w-full lg:w-[350px] ${isExpandView ? 'xl:w-full' : 'xl:min-w-[450px]'} h-screen max-h-[750px] overflow-auto bg-white space-y-4 pb-10 scroll-smooth border rounded-xl px-2 py-4`}>
                    {/* <div className="w-full h-[1000px]">

                </div> */}
                    {
                        data?.contents?.courseContents?.map((data, index) =>
                            <ContentCard
                                key={index}
                                data={data}
                                videoId={videoId}
                                setVideoId={setVideoId}
                                milestoneId={milestoneId}
                                setMilestoneId={setMilestoneId}
                                activeItemRef={activeItemRef}
                                setVideoDescription={setVideoDescription}
                                setVideoTitle={setVideoTitle}
                            />
                        )
                    }
                </div>
            </div>
        </section>
    );
};

const ContentCard = ({ data, videoId, setVideoId, milestoneId, setMilestoneId, activeItemRef, setVideoDescription, setVideoTitle }) => {
    const { _id, milestoneName, milestoneModules } = data;
    const reduceCurrentItem = (moduleItems) => {
        const modulesDuration = moduleItems.reduce((acc, curr) => acc + (curr?.duration || 0), 0);
        return modulesDuration;
    }
    const milestoneDurationInSec = milestoneModules.reduce((acc, curr) => acc + reduceCurrentItem(curr.moduleItems), 0);
    const milestoneDurationInHours = formatTimeWithHours(milestoneDurationInSec);
    console.log("milestone time", milestoneDurationInHours);
    const milestoneVideoCount = milestoneModules.reduce((acc, curr) => acc + curr.moduleItems.length, 0);
    console.log('milestone total video', milestoneVideoCount);



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
                        0/{milestoneVideoCount}
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
                        />
                    )
                }
            </div>
        </div>
    )
}

const MilestoneModule = ({ milestoneId, milestoneModule, videoId, setVideoId, setMilestoneId, setVideoDescription, setVideoTitle }) => {
    const { moduleName, moduleItems } = milestoneModule;
    const totalModuleTimeInSec = moduleItems.reduce((acc, curr) => acc + (curr?.duration || 0), 0);
    const totalModuleDuration = formatTimeWithHours(totalModuleTimeInSec)
    const modulesVideoCount = moduleItems.length;
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
                        0/{modulesVideoCount}
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
                        />
                    )
                }
            </div>
        </div>
    )
};

const ModuleItem = ({ moduleData, videoId, setVideoId, setVideoDescription, setVideoTitle }) => {
    const { itemType, itemName, itemData, itemDescription, duration } = moduleData;
    console.log(duration);
    const videoDuration = formatTimeWithMin(duration)

    if (itemData === videoId) {
        setVideoTitle(itemName);
        setVideoDescription(itemDescription);
    }
    return (
        <div onClick={() => setVideoId(itemData)}>
            <div className={`text-sm font-normal p-3  rounded-md cursor-pointer ${videoId === itemData ? 'text-white bg-black' : 'bg-slate-200 text-black shadow-'}`}>
                {itemName}
                <div className={`flex items-center gap-x-2 mt-2 ${videoId === itemData ? 'text-white' : 'text-gray-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-6`} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.5} d="M22.54 6.42a2.77 2.77 0 0 0-1.945-1.957C18.88 4 12 4 12 4s-6.88 0-8.595.463A2.77 2.77 0 0 0 1.46 6.42C1 8.148 1 11.75 1 11.75s0 3.602.46 5.33a2.77 2.77 0 0 0 1.945 1.958C5.121 19.5 12 19.5 12 19.5s6.88 0 8.595-.462a2.77 2.77 0 0 0 1.945-1.958c.46-1.726.46-5.33.46-5.33s0-3.602-.46-5.33ZM9.75 15.021V8.48l5.75 3.271z"></path></svg>
                    {videoDuration}
                </div>
            </div>
        </div>
    )
}
export default ViewCourse;