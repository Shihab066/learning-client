import Swal from "sweetalert2";
import AddModuleItem from "./ModuleData/AddModuleItem";
import ModuleItemSection from "./ModuleData/ModuleItemSection";
import UpdateModule from "./UpdateModule";

const ModuleSection = ({ item, milestoneId, milestonesData, setMilestonesData }) => {
    // Function to delete the module
    const deleteModule = () => {
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
                const updatedMilestones = milestonesData.map(milestone =>
                    milestone._id === milestoneId
                        ? {
                            ...milestone,
                            milestoneModules: milestone.milestoneModules.filter(mod => mod.id !== item.id)
                        }
                        : milestone
                );
                setMilestonesData(updatedMilestones);
            }
        });
    };

    // Retrieve the module items for this milestone
    const moduleItems = milestonesData
        .find(milestone => milestone._id === milestoneId)?.milestoneModules
        .find(mod => mod.id === item.id)?.moduleItems || [];

    return (
        <>
            <div className="collapse collapse-arrow bg-gray-100 duration-300">
                <input type="checkbox" name="moduleAccordion" />
                <div className="collapse-title text-xl font-medium">
                    <span className="relative">
                        {item.moduleName}
                        <div className="z-10 absolute inline ml-4 space-x-4">
                            {/* Module Edit Button */}
                            <label htmlFor={`${item.id}moduleUpdate`} className="link text-sm font-normal text-blue-700">
                                Edit
                            </label>

                            {/* Module Delete Button */}
                            <label onClick={deleteModule} className="link text-sm font-normal text-blue-700">
                                Delete
                            </label>

                            {/* Add Module Item Button */}
                            <label htmlFor={`${item.id}addModuleItem`} className="link text-sm font-normal text-blue-700">
                                Add&nbsp;Module&nbsp;Item
                            </label>
                        </div>
                    </span>
                </div>

                {/* Render the list of module items */}
                <div className="collapse-content space-y-2">
                    {moduleItems.map(moduleItem => (
                        <ModuleItemSection
                            key={moduleItem.id}
                            moduleItem={moduleItem}
                            moduleId={item.id}
                            milestoneId={milestoneId}
                            milestonesData={milestonesData}
                            setMilestonesData={setMilestonesData}
                        />
                    ))}
                </div>
            </div>

            {/* Module Update Modal */}
            <UpdateModule
                milestoneId={milestoneId}
                moduleId={item.id}
                name={item.moduleName}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />

            {/* Add Module Item Modal */}
            <AddModuleItem
                milestoneId={milestoneId}
                moduleId={item.id}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />
        </>
    );
};

export default ModuleSection;
