import Swal from "sweetalert2";
import AddModule from "./AddModule/AddModule";
import ModuleSection from "./AddModule/ModuleSection";
import MilestoneDetailsModal from "./MilestoneDetailsModal";
import UpdateMilestone from "./UpdateMilestone";

const MilestoneSection = ({ id, milestoneName, milestoneDetails, milestonesData, setMilestonesData }) => {

    // Function to delete a milestone
    const deleteMilestoneData = (milestoneId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Filter out the deleted milestone
                const updatedMilestones = milestonesData.filter(item => item._id !== milestoneId);
                setMilestonesData(updatedMilestones);
            }
        });
    };

    // Find the modules for the current milestone
    const currentMilestoneModules = milestonesData.find(item => item._id === id)?.milestoneModules || [];

    return (
        <>
            {/* Milestone accordion */}
            <div className="collapse collapse-arrow border bg-white duration-[400ms]">
                <input type="checkbox" name="milestoneAccordion" />
                <div className="collapse-title text-xl font-medium space-x-2">
                    <span className="relative">
                        {milestoneName}
                        <div className="z-50 absolute inline ml-4 space-x-4">
                            {/* Milestone details modal button */}
                            <label htmlFor={`${id}details`} className="link text-sm font-normal text-blue-700">
                                Details
                            </label>

                            {/* Milestone update modal button */}
                            <label htmlFor={`${id}update`} className="link text-sm font-normal text-blue-700">
                                Edit
                            </label>

                            {/* Milestone delete button */}
                            <label
                                onClick={() => deleteMilestoneData(id)}
                                className="link text-sm font-normal text-blue-700"
                            >
                                Delete
                            </label>

                            {/* Button to create a new module */}
                            <label htmlFor={`${id}addModule`} className="link text-sm font-normal text-blue-700 inline">
                                AddModule
                            </label>
                        </div>
                    </span>
                </div>

                {/* Module sections */}
                <div className="collapse-content space-y-2 bg-white">
                    {currentMilestoneModules.map(module => (
                        <ModuleSection
                            key={module.id}
                            item={module}
                            milestoneId={id}
                            milestonesData={milestonesData}
                            setMilestonesData={setMilestonesData}
                        />
                    ))}
                </div>
            </div>

            {/* Modals */}
            {/* Milestone details modal */}
            <MilestoneDetailsModal
                id={id}
                milestoneName={milestoneName}
                milestoneDetails={milestoneDetails}
            />

            {/* Milestone update modal */}
            <UpdateMilestone
                id={id}
                name={milestoneName}
                details={milestoneDetails}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />

            {/* Add module modal */}
            <AddModule
                id={id}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />
        </>
    );
};

export default MilestoneSection;
