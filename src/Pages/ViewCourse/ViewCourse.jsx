import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { useQuery } from "@tanstack/react-query";
import api from "../../services/baseAPI";
import { useState } from "react";

const ViewCourse = () => {
    const { courseId } = useParams();
    console.log(courseId);

    const { data } = useQuery({
        queryKey: ['course-contents'],
        queryFn: async () => {
            const res = await api.get(`/course/content/fs/${courseId}`);
            return res.data;
        }
    });

    const { courseName, courseContents } = data;

    const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
    return (
        <section className="lg-container flex gap-x-6 px-4 pt-10">
            <div className="w-full">
                <VideoPlayer />
            </div>

            {
                courseContents?.map((data, index) =>
                    <ContentCard
                        key={index}
                        data={data}
                    />
                )
            }
        </section>
    );
};

const ContentCard = ({ data }) => {
    const { milestoneName, milestoneModules } = data;
    return (
        <div className="w-[600px] h-screen bg-white space-y-4">
            <div className="collapse collapse-custom bg-white border rounded-lg ">
                <input type="checkbox" name="my-accordion-3" />

                {/* Milestone Name */}
                <div className="collapse-title collapse-custom-icon text-xl font-medium relative">
                    {milestoneName}
                </div>

                {/* Milestone Modules */}
                <div className="collapse-content space-y-4">
                    {
                        milestoneModules?.map((milestoneModule, index) =>
                            <MilestoneModules
                                key={index}
                                milestoneModule={milestoneModule}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

const MilestoneModules = ({ milestoneModule }) => {
    const { moduleName, moduleItems } = milestoneModule;
    return (
        <div className="collapse collapse-arrow bg-base-200 rounded-lg">
            <input type="checkbox" name="my-accordion-2" />
            {/* Module Name */}
            <div className="collapse-title text-xl font-medium">
                {moduleName}
            </div>

            {/* Modules Items */}
            <div className="collapse-content">
                {
                    moduleItems?.map((moduleData, index) =>
                        <ModuleItem
                            key={index}
                            moduleData={moduleData}
                        />
                    )
                }
            </div>
        </div>
    )
};

const ModuleItem = ({ moduleData }) => {
    const {itemType, itemName, itemData, itemDescription } = moduleData;
    return (
        <div className="p-3 border-b bg-blue-50">
            {itemName}
        </div>
    )
}
export default ViewCourse;