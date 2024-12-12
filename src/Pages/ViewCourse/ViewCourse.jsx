import { useNavigate, useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/baseAPI";
import { useEffect, useRef, useState } from "react";

const ViewCourse = () => {
    const { courseId } = useParams();
    console.log(courseId);

    const { data = {} } = useQuery({
        queryKey: ['course-contents'],
        queryFn: async () => {
            const res = await api.get(`/course/content/fs/${courseId}`);
            return res.data;
        }
    });
    console.log(data);

    const [videoIds, setVideoIds] = useState([]);
    const [milestoneId, setMilestoneId] = useState('');
    const [videoId, setVideoId] = useState('');
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [isExpandView, setExpandView] = useState(false);
    const activeItemRef = useRef();
    const containerRef = useRef();
    const navigate = useNavigate();

    console.log(videoTitle)
    console.log(videoDescription)

    useEffect(() => {
        setMilestoneId("67529190d5c9fb13e22175a6");
        setVideoId("wgs3rcdhgngvd2rei3pw");
    }, [])

    useEffect(() => {
        const allVideoIds = data?.courseContents?.flatMap(milestones =>
            milestones.milestoneModules.flatMap(milestoneModule =>
                milestoneModule.moduleItems.map(moduleItem => moduleItem.itemData)
            )
        );
        setVideoIds(allVideoIds);
    }, [data]);


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

    console.log(isExpandView)

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
                            <div className="mt-4 bg-white h-56 rounded-md overflow-y-auto md-scrollbar">
                                {videoDescription}
                            </div>
                        </div>
                    }
                </div>

                <div ref={containerRef} className={`w-full lg:w-[350px] ${isExpandView ? 'xl:w-full' : 'xl:min-w-[450px]'} h-screen max-h-[750px] overflow-auto bg-white space-y-4 pb-10 scroll-smooth border rounded-xl px-2 py-4`}>
                    {/* <div className="w-full h-[1000px]">

                </div> */}
                    {
                        data?.courseContents?.map((data, index) =>
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
    const { itemType, itemName, itemData, itemDescription } = moduleData;
    if (itemData === videoId) {
        setVideoTitle(itemName);
        setVideoDescription(itemDescription);
    }
    return (
        <div
            onClick={() => setVideoId(itemData)}
            className={`text-sm font-normal p-3  rounded-md cursor-pointer ${videoId === itemData ? 'text-white bg-black' : 'bg-slate-200 text-black shadow-'}`}
        >
            {itemName}
        </div>
    )
}
export default ViewCourse;