import Swal from "sweetalert2";
import AddModuleItem from "./ModuleData/AddModuleItem";
import ModuleItemSection from "./ModuleData/ModuleItemSection";
import UpdateModule from "./UpdateModule";
import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';

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

    const [isMilestoneItemOptionOpen, setIsMilestoneItemOptionOpen] = useState(false);
    const optionsRef = useRef();

    const handleOption = () => {
        setIsMilestoneItemOptionOpen(false)
    }

    return (
        <>
            <div className="relative">
                <div className="collapse collapse-arrow bg-gray-100 duration-300 rounded-md">
                    <input type="checkbox" name="moduleAccordion" />
                    <div className="collapse-title sm:text-lg font-medium pl-2 sm:pl-4 truncate pr-16">
                        {item.moduleName}
                    </div>

                    {/* Render the list of module items */}
                    <div className="collapse-content pl-2 sm:pl-4 space-y-2 overflow-hidden">
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

                {/* milestone modify button */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMilestoneItemOptionOpen(!isMilestoneItemOptionOpen)
                    }}
                    ref={optionsRef}
                    className="w-fit h-fit absolute right-10 top-5 z-30 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-gray-700 ml-auto relative" viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
                </div>
                {
                    isMilestoneItemOptionOpen &&
                    <ModuleOptions
                        optionsRef={optionsRef}
                        handleOption={handleOption}
                        name={item.moduleName}
                        moduleId={item.id}
                        milestoneId={milestoneId}
                        deleteModule={deleteModule}
                        milestonesData={milestonesData}
                        setMilestonesData={setMilestonesData}
                    />
                }

            </div>
        </>
    );
};

const ModuleOptions = ({ moduleId, deleteModule, optionsRef, handleOption, milestoneId, name, milestonesData, setMilestonesData }) => {
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
            className="fixed w-40 z-30 h-fit px-2 py-3 space-y-1 bg-white text-white rounded-md shadow-md"
        >
            {/* Button to create a new module item */}
            <li onClick={(e) => e.stopPropagation()}>
                <label
                    htmlFor={`${moduleId}addModuleItem`}
                    className="flex gap-x-1 w-full px-2 py-1.5 border bg-blue-600 rounded-md hover:shadow-lg duration-300 cursor-pointer"
                    title="Add Module Item"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24">
                        <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                            <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16"></path>
                            <path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z"></path>
                        </g>
                    </svg>
                    <span>Module Item</span>
                </label>
            </li>

            {/* Button to open the module update modal */}
            <li>
                <label
                    htmlFor={`${moduleId}moduleUpdate`}
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

            {/* Button to delete the module */}
            <li>
                <label
                    onClick={deleteModule}
                    className="flex gap-x-1 w-full px-2 py-1.5 border bg-red-600 rounded-md hover:shadow-lg duration-300 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5">
                        <path fill="currentColor" d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"></path>
                    </svg>
                    <span>Delete</span>
                </label>
            </li>

            {/* Add Module Item Modal */}
            <AddModuleItem
                milestoneId={milestoneId}
                moduleId={moduleId}
                milestonesData={milestonesData}
                setMilestonesData={setMilestonesData}
            />

            {/* Module Update Modal */}
            <UpdateModule
                milestoneId={milestoneId}
                moduleId={moduleId}
                name={name}
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


export default ModuleSection;
