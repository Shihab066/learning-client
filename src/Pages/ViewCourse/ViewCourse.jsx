import { useParams } from "react-router-dom";
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
    console.log(data)


    const [videoIds, setVideoIds] = useState([]);
    const [milestoneId, setMilestoneId] = useState('');
    const [videoId, setVideoId] = useState('');
    const activeItemRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        setMilestoneId("67529190d5c9fb13e22175a6")
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

    return (
        <section className="lg-container flex gap-x-6 px-4 pt-10">
            <div className="flex-grow">
                <VideoPlayer
                    videoIds={videoIds}
                    videoId={videoId}
                    setVideoId={setVideoId}
                    handleNextButton={handleNextButton}
                    handlePrevButton={handlePrevButton}
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
            </div>

            <div ref={containerRef} className="w-[450px] h-screen max-h-[750px] overflow-auto bg-white space-y-4 pb-10 scroll-smooth border rounded-xl px-2 py-4">
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
                        />
                    )
                }
            </div>
        </section>
    );
};

const ContentCard = ({ data, videoId, setVideoId, milestoneId, setMilestoneId, activeItemRef }) => {
    const { _id, milestoneName, milestoneModules } = data;
    const milestoneRef = useRef();
    useEffect(() => {
        if (milestoneId === _id) {
            milestoneRef.current.checked = true;
        } else {
            milestoneRef.current.checked = false;
        }
    }, [milestoneId, _id]);


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
                        />
                    )
                }
            </div>
        </div>
    )
}

const MilestoneModule = ({ milestoneId, milestoneModule, videoId, setVideoId, setMilestoneId }) => {
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
                        />
                    )
                }
            </div>
        </div>
    )
};

const ModuleItem = ({ moduleData, videoId, setVideoId }) => {
    const { itemType, itemName, itemData, itemDescription } = moduleData;
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