import Swal from "sweetalert2";
import UpdateModuleItem from "./UpdateModuleItem";

const ModuleItemSection = ({ moduleItem, moduleId, milestoneId, milestonesData, setMilestonesData }) => {

    // Function to update milestone data by removing the selected module item
    const removeModuleItem = () => {
        const updateModules = (modules) => {
            return modules.map(mod =>
                mod.id === moduleId
                    ? {
                        ...mod,
                        moduleItems: mod.moduleItems.filter(item => item.id !== moduleItem.id)
                    }
                    : mod
            );
        };

        const updatedMilestones = milestonesData.map(milestone =>
            milestone._id === milestoneId
                ? { ...milestone, milestoneModules: updateModules(milestone.milestoneModules) }
                : milestone
        );

        setMilestonesData(updatedMilestones);
    };

    // Delete module item with confirmation
    const deleteModuleItem = () => {
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
                removeModuleItem();
            }
        });
    };

    return (
        <>
            {/* Display Module Item with Edit and Delete Options */}
            <div className="text-lg font-medium rounded-lg bg-blue-100 py-2 px-3">
                <span className="relative">
                    {moduleItem.itemName}
                    <div className="z-10 absolute inline ml-4 space-x-4">
                        {/* Edit Module Item Button */}
                        <label htmlFor={`${moduleItem.id}updateModuleItem`} className="link text-sm font-normal text-blue-700">
                            Edit
                        </label>

                        {/* Delete Module Item Button */}
                        <span onClick={deleteModuleItem} className="link text-sm font-normal text-blue-700 cursor-pointer">
                            Delete
                        </span>
                    </div>
                </span>
            </div>

            {/* Modal to Update the Module Item */}
            <UpdateModuleItem
                moduleItem={moduleItem}
                moduleId={moduleId}
                milestoneId={milestoneId}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />
        </>
    );
};

export default ModuleItemSection;
