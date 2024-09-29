import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AddMilestone from "../AddMilestone/AddMilestone";
import MilestoneSection from "../AddMilestone/MilestoneSection";

const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const UpdateCourse = ({ setIsUpdateCourseOpen }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_secret_key}`;
    const [image, setImage] = useState('');

    // Handle form submission
    const onSubmit = async (data) => {
        const { name, description, seats, price } = data;
        const { displayName, email } = user;
        const newClass = {
            name,
            description,
            image,
            instructorName: displayName,
            seats: parseFloat(seats),
            students: 0,
            price: parseFloat(price),
            email,
            status: 'pending',
            feedback: ''
        };

        // Uncomment the axios post request to send data to the server
        /*
        axiosSecure.post('/classes', newClass)
            .then(res => {
                if (res.data.insertedId) {
                    resetForm();
                    showSuccessMessage();
                }
            });
        */
    };

    // Reset form and clear the image state
    const resetForm = () => {
        setImage('');
        reset();
    };

    // Show success message using SweetAlert2
    const showSuccessMessage = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Class Added Successfully',
            showConfirmButton: false,
            timer: 2000
        });
    };

    // Prevent form submission when pressing Enter key
    const handleEnterButton = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // Handle image upload to the hosting service
    const handleImage = async (event) => {
        const img = event.target.files[0];
        if (img) {
            const formData = new FormData();
            formData.append('image', img);

            const response = await fetch(img_hosting_url, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                setImage(data.data.display_url);
            } else {
                setImage('');
            }
        }
    };

    // Dummy milestone data for demonstration purposes
    const initialMilestones = [
        {
            _id: '4fd6s4fs4f65d46fa4',
            milestoneName: 'Milestone1: Welcome',
            milestoneDetails: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, accusamus.',
            milestoneModules: [
                {
                    id: '4fd6s4fs4f65d46fa4fdsafada',
                    moduleName: 'Module1: Basic HTML, CSS',
                    moduleItems: [
                        { id: '1', itemName: 'HTML Tags', itemData: '#' },
                        { id: '2', itemName: 'CSS Basics', itemData: '#' }
                    ]
                },
                {
                    id: '4fd6s4fs4f65d46fa4hthtjhje',
                    moduleName: 'Module2: JavaScript Fundamentals',
                    moduleItems: [
                        { id: '3', itemName: 'JavaScript Variables', itemData: '#' },
                        { id: '4', itemName: 'Functions in JS', itemData: '#' }
                    ]
                }
            ]
        }
    ];

    const [milestonesData, setMilestonesData] = useState(initialMilestones);

    return (
        <>
            {/* Put this part before </body> tag
            // <input type="checkbox" id="my-modal-2" className="modal-toggle" />
            // <div className="modal" role="dialog">
            //     <div className="modal-box w-11/12 max-w-5xl overflow-hidden p-0">
            //         <div className="modal-action">
            //             <label htmlFor={`my-modal-2`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
            //         </div>

            //     </div>
            // </div> */}
            <div className="w-full h-fit px-8 py-8 border rounded-xl bg-white relative">
                <label onClick={() => setIsUpdateCourseOpen(false)} className="btn btn-sm btn-circle absolute right-4 top-4">✕</label>
                <h3 className="text-lg text-gray-900 font-bold">Update Course</h3>
                <div onKeyDown={handleEnterButton} className="w-full mt-6 rounded-lg text-gray-900">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                        {/* Class Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Class Name</span>
                            </label>
                            <input
                                type="text"
                                autoComplete="off"
                                placeholder="Class Name"
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                                {...register('name', { required: true })}
                            />
                            {errors.name && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Upload Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleImage}
                                className="file-input file-input-bordered border-base-300 focus:border-blue-500 focus:outline-0"
                            />
                        </div>

                        {/* short Description about course */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Short Description</span>
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Short Description"
                                className="textarea textarea-info border-base-300 focus:border-blue-500 focus:outline-0 resize-none"
                                {...register('description', { required: true })}
                            />
                            {errors.description && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Class Full Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Description</span>
                            </label>
                            <textarea
                                rows="5"
                                placeholder="Description"
                                className="textarea textarea-info border-base-300 focus:border-blue-500 focus:outline-0 resize-none"
                                {...register('description', { required: true })}
                            />
                            {errors.description && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Course Outline */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Course Outline</span>
                            </label>
                            <div className="w-full h-full border p-4 rounded-lg">
                                {/* Button to trigger modal */}
                                <label htmlFor="newMilestone" className="btn bg-blue-600 hover:bg-blue-700 text-white duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Add New Milestone
                                </label>
                                <div className="space-y-2 mt-2">
                                    {milestonesData.map((milestone) => (
                                        <MilestoneSection
                                            key={milestone._id}
                                            id={milestone._id}
                                            milestoneName={milestone.milestoneName}
                                            milestoneDetails={milestone.milestoneDetails}
                                            milestonesData={milestonesData}
                                            setMilestonesData={setMilestonesData}
                                        />
                                    ))}
                                    <AddMilestone
                                        milestonesData={milestonesData}
                                        setMilestonesData={setMilestonesData}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Seats */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Seats</span>
                            </label>
                            <input
                                type="number"
                                autoComplete="off"
                                className={`input input-info border-base-300 ${errors.seats?.type === 'min' ? 'border-red-500 text-red-500' : 'focus:border-blue-500'} focus:outline-0`}
                                {...register('seats', { required: true, min: 0 })}
                            />
                            {errors.seats && errors.seats.type === 'min' && <span className="text-red-600">Seats number cannot be negative</span>}
                        </div>

                        {/* Price */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input
                                type="number"
                                autoComplete="off"
                                className={`input input-info border-base-300 ${errors.price?.type === 'min' ? 'border-red-500 text-red-500' : 'focus:border-blue-500'} focus:outline-0`}
                                {...register('price', { required: true, min: 0 })}
                            />
                            {errors.price && errors.price.type === 'min' && <span className="text-red-600">Price cannot be negative</span>}
                        </div>

                        {/* Discount Price */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Discount Price</span>
                            </label>
                            <input
                                type="number"
                                autoComplete="off"
                                className={`input input-info border-base-300 ${errors.price?.type === 'min' ? 'border-red-500 text-red-500' : 'focus:border-blue-500'} focus:outline-0`}
                                {...register('price', { required: true, min: 0 })}
                            />
                            {errors.price && errors.price.type === 'min' && <span className="text-red-600">Price cannot be negative</span>}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <input
                                type="submit"
                                value="Add Class"
                                className="mt-4 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateCourse;
