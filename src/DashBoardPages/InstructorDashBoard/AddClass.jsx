import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AddMilestone from "./AddMilestone/AddMilestone";
import MilestoneSection from "./AddMilestone/MilestoneSection";

const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const AddClass = () => {
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
        <div onKeyDown={handleEnterButton} className="px-8 pb-10 w-[98%] ml-auto shadow-2xl rounded-lg h-[700px] overflow-y-auto">
            <h3 className="text-center py-5 font-bold text-4xl">Add Class</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Class Name */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Class Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Class Name"
                        className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                        {...register('name', { required: true })}
                    />
                    {errors.name && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Class Description */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
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
                    <div className="w-full min-h-[200px] border rounded-lg p-4 pb-20 relative">
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

                {/* Image Upload */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Image</span>
                    </label>
                    <input
                        type="file"
                        onChange={handleImage}
                        className="file-input file-input-bordered border-base-300 focus:border-blue-500 focus:outline-0"
                    />
                </div>

                {/* Instructor Name */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Instructor Name</span>
                    </label>
                    <input
                        type="text"
                        defaultValue={user?.displayName}
                        disabled
                        className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                    />
                </div>

                {/* Instructor Email */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">E-mail</span>
                    </label>
                    <input
                        type="email"
                        defaultValue={user?.email}
                        disabled
                        className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                    />
                </div>

                {/* Seats */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Seats</span>
                    </label>
                    <input
                        type="number"
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
                        className={`input input-info border-base-300 ${errors.price?.type === 'min' ? 'border-red-500 text-red-500' : 'focus:border-blue-500'} focus:outline-0`}
                        {...register('price', { required: true, min: 0 })}
                    />
                    {errors.price && errors.price.type === 'min' && <span className="text-red-600">Price cannot be negative</span>}
                </div>

                {/* Submit Button */}
                <input
                    type="submit"
                    value="Add Class"
                    className="mt-5 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case"
                />
            </form>
        </div>
    );
};

export default AddClass;
