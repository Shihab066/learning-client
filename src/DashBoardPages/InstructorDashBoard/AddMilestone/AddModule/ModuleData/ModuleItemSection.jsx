import Swal from "sweetalert2";
import UpdateModuleItem from "./UpdateModuleItem";
import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';

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

    const [isMilestoneItemOptionOpen, setIsMilestoneItemOptionOpen] = useState(false);
    const optionsRef = useRef();

    const handleOption = () => {
        setIsMilestoneItemOptionOpen(false)
    }

    return (
        <>
            {/* Display Module Item with Edit and Delete Options */}
            <div className="relative">
                <div className="sm:text-lg font-medium rounded-lg bg-blue-100 py-2 px-3 pr-8 truncate">
                    {moduleItem.itemName}
                </div>
                {/* module item modify button */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMilestoneItemOptionOpen(!isMilestoneItemOptionOpen)
                    }}
                    ref={optionsRef}
                    className="w-fit h-fit absolute right-2 top-1/2 -translate-y-1/2 z-30 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-gray-700 ml-auto relative" viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
                </div>
                {
                    isMilestoneItemOptionOpen &&
                    <ModuleItemOptions
                        optionsRef={optionsRef}
                        handleOption={handleOption}
                        deleteModuleItem={deleteModuleItem}
                        moduleItem={moduleItem}
                        moduleId={moduleId}
                        milestoneId={milestoneId}
                        milestonesData={milestonesData}
                        setMilestonesData={setMilestonesData}
                    />
                }
            </div>
        </>
    );
};

const ModuleItemOptions = ({ optionsRef, handleOption, deleteModuleItem, moduleItem, moduleId, milestoneId, milestonesData, setMilestonesData }) => {
    const [position, setPosition] = useState({ top: -100, left: -100 });

    // Function to handle and update the position of the options menu
    const handlePosition = () => {
        if (optionsRef.current) {
            const rect = optionsRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top,
                left: rect.left,
            });
        }
    };

    // Attach scroll event listener to update position dynamically
    useEffect(() => {
        handlePosition();
        window.addEventListener('scroll', handlePosition);

        return () => {
            window.removeEventListener('scroll', handlePosition);
        };
    }, []);

    // Handle clicks outside the options menu to close it
    useEffect(() => {
        const rootElement = document.getElementById('root');
        rootElement.addEventListener('click', handleOption);

        return () => {
            rootElement.removeEventListener('click', handleOption);
        };
    }, [handleOption]);

    // Inline styles for the options dropdown
    const optionsStyle = {
        top: `${position.top + 30}px`,
        left: `${position.left - 135}px`,
    };

    const options = (
        <ul
            onClick={(e) => e.stopPropagation()}
            style={optionsStyle}
            className="fixed w-40 z-40 h-fit px-2 py-3 space-y-1 bg-white text-white rounded-md shadow-md"
        >

            {/* Button to open the module item update modal */}
            <li>
                <label
                    htmlFor={`${moduleItem.id}updateModuleItem`}
                    className="flex gap-x-1 w-full px-2 py-1.5 border bg-yellow-600 rounded-md hover:shadow-lg duration-300 cursor-pointer"
                    title="Edit Module"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5">
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                            <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path>
                            <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path>
                        </g>
                    </svg>
                    <span>Edit</span>
                </label>
            </li>

            {/* Button to delete the module item */}
            <li>
                <label
                    onClick={deleteModuleItem}
                    className="flex gap-x-1 w-full px-2 py-1.5 border bg-red-600 rounded-md hover:shadow-lg duration-300 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5">
                        <path fill="currentColor" d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"></path>
                    </svg>
                    <span>Delete</span>
                </label>
            </li>

            {/* Modal to Update the Module Item */}
            <UpdateModuleItem
                moduleItem={moduleItem}
                moduleId={moduleId}
                milestoneId={milestoneId}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />
        </ul>
    );

    // Render the options as a portal to avoid layout issues
    return ReactDOM.createPortal(
        options,
        document.getElementById('portal-root')
    );
};
export default ModuleItemSection;
