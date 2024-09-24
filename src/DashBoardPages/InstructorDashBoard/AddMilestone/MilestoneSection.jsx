import Swal from "sweetalert2";
import AddModule from "./AddModule/AddModule";
import ModuleSection from "./AddModule/ModuleSection";
import MilestoneDetailsModal from "./MilestoneDetailsModal";
import UpdateMilestone from "./UpdateMilestone";
import { useEffect, useRef, useState } from "react";

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
    
    const [isMilestoneOptionOpen, setIsMilestoneOptionOpen] = useState(false);    

    const handleOption = () => {
        if (isMilestoneOptionOpen) {
            setIsMilestoneOptionOpen(false)
        }
    }

    return (
        <>
            {/* Milestone accordion */}
            <div className="relative">
                <div className="collapse collapse-arrow border bg-white duration-[400ms] rounded-lg">
                    <input type="checkbox" name="milestoneAccordion" />
                    <div className="collapse-title text-lg font-medium">
                        {milestoneName}
                    </div>

                    {/* Module sections */}
                    <div className="collapse-content space-y-2 bg-white">
                        {currentMilestoneModules.map(mod => (
                            <ModuleSection
                                key={mod.id}
                                item={mod}
                                milestoneId={id}
                                milestonesData={milestonesData}
                                setMilestonesData={setMilestonesData}
                            />
                        ))}
                    </div>
                </div>
                {/* milestone modify button */}
                <div className="w-fit h-6 absolute right-10 top-5 z-50 cursor-pointer">
                    <svg
                        onClick={(e) => {
                            setIsMilestoneOptionOpen(!isMilestoneOptionOpen)
                            e.stopPropagation();
                        }}
                        xmlns="http://www.w3.org/2000/svg" className="h-6 text-gray-700 ml-auto" viewBox="0 0 256 256"><path fill="currentColor" d="M112 60a16 16 0 1 1 16 16a16 16 0 0 1-16-16m16 52a16 16 0 1 0 16 16a16 16 0 0 0-16-16m0 68a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
                    {
                        isMilestoneOptionOpen &&
                        <OptionsBody
                            id={id}
                            deleteMilestoneData={deleteMilestoneData}
                            milestoneName={milestoneName}
                            milestoneDetails={milestoneDetails}
                            milestonesData={milestonesData}
                            setMilestonesData={setMilestonesData}
                            handleOption={handleOption}
                        />
                    }
                </div>
            </div>
        </>
    );
};

const OptionsBody = ({ id, deleteMilestoneData, milestoneName, milestoneDetails, milestonesData, setMilestonesData, handleOption }) => {
    const optionsRef = useRef();
    // Handle clicks outside the options menu to close it
    useEffect(() => {
        const rootElement = document.getElementById('root');
        
        // Function to check if the click is inside modal
        const handleClick = (event) => {
            if (optionsRef.current && optionsRef.current.contains(event.target)) {
                // Click is inside the modal, do nothing
                return;
            }
            handleOption(); // Click is outside, trigger the function
        };

        rootElement.addEventListener('click', handleClick);

        return () => {
            rootElement.removeEventListener('click', handleClick);
        };
    }, [handleOption]);
    return (
        <ul ref={optionsRef} onClick={(e) => e.stopPropagation()} className={`w-40 h-fit px-2 py-3 rounded-md shadow-md bg-white text-white space-y-1`}>
            {/* Button to create a new module */}
            <li>
                <label htmlFor={`${id}addModule`} className='w-full flex gap-x-2 border rounded-md px-2 py-1.5 bg-blue-600 hover:shadow-lg duration-300 cursor-pointer' title='feedback'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12m10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16"></path><path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4z"></path></g></svg>
                    <span>
                        Add module
                    </span>
                </label>
            </li>
            {/* Milestone update modal button */}
            <li>
                <label htmlFor={`${id}update`} className='w-full flex gap-x-2 border rounded-md px-2 py-1.5 bg-yellow-600 hover:shadow-lg duration-300 cursor-pointer' title='feedback'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5'><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path></g>
                    </svg>
                    <span>
                        Edit
                    </span>
                </label>
            </li>
            {/* Milestone delete button */}
            <li>
                <label
                    onClick={() => deleteMilestoneData(id)}
                    className='w-full flex gap-x-2 border rounded-md px-2 py-1.5 bg-red-600 hover:shadow-lg duration-300 cursor-pointer'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-5'>
                        <path fill="currentColor" d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"></path>
                    </svg>
                    <span>
                        Delete
                    </span>
                </label>
            </li>

            {/* Milestone details modal button */}
            <li>
                <label htmlFor={`${id}details`} className='w-full flex gap-x-2 border rounded-md px-2 py-1.5 bg-green-600 hover:shadow-lg duration-300 cursor-pointer' title='feedback'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 32 32"><g fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9h4m-4 7h12m-12 4h12m-12 4h4m-6 5h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v22a2 2 0 0 0 2 2"></path><circle cx={22} cy={9} r={0.5} fill="currentColor"></circle></g></svg>
                    <span>
                        Details
                    </span>
                </label>
            </li>

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
        </ul>
    )
}

export default MilestoneSection;
