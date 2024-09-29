import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AddMilestone from "./AddMilestone/AddMilestone";
import MilestoneSection from "./AddMilestone/MilestoneSection";
import dummyThumbnail from '../../assets/images/dummyCourseThumbnail.png';

const imgHostingSecretKey = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const AddClass = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const imgHostingUrl = `https://api.imgbb.com/1/upload?key=${imgHostingSecretKey}`;
    const [thumbnail, setThumbnail] = useState(null);
    const [milestonesData, setMilestonesData] = useState([]);
    const [courseContentError, setCourseContentError] = useState(false);
    const [checkCourseContentError, setCheckCourseContentError] = useState(false);

    // Handle course thumbnail change
    const handleCourseThumbnail = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(URL.createObjectURL(file));
        } else {
            setThumbnail(null);
            alert('Please select a valid image file.');
        }
    };

    // Validate course content (milestones)
    const validateCourseContent = () => {
        const courseContentLength = milestonesData[0]?.milestoneModules[0]?.moduleItems?.length ?? 0;
        setCourseContentError(courseContentLength === 0);
        setCheckCourseContentError(true);
    };

    useEffect(() => {
        if (checkCourseContentError) {
            validateCourseContent();
        }
    }, [milestonesData]);

    // Handle form submission
    const onSubmit = async (data) => {
        const { courseName, courseThumbnail, shortDescription, description, level, category, seats, price } = data;
        
        if (courseContentError) return;

        const { email } = user;
        const uploadedThumbnail = await uploadThumbnail(courseThumbnail[0]);

        const newClass = {
            email,
            courseName,
            courseThumbnail: uploadedThumbnail,
            shortDescription,
            description,
            level,
            category,
            seats: parseInt(seats),
            price: parseFloat(price),
            courseContents: milestonesData,
            publish: true
        };

        axiosSecure.post('/classes', newClass).then(res => {
            if (res.data.insertedId) {
                resetForm();
                showSuccessMessage();
            }
        });
    };
    
    const uploadThumbnail = async (img) => {
        if (img) {
            const formData = new FormData();
            formData.append('image', img);
            const response = await fetch(imgHostingUrl, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                return data.data.display_url;
            }
        }
        return null;
    };
    
    const resetForm = () => {
        setThumbnail(null);
        setMilestonesData([]);
        setCheckCourseContentError(false);
        reset();
    };
    
    const showSuccessMessage = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Class Added Successfully',
            showConfirmButton: false,
            timer: 2000
        });
    };

    // Prevent form submission when pressing Enter key. It's used because enter button trigger the submit button when adding course contents items.
    const handleEnterButton = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    // Course level options
    const courseLevelOptions = [
        { value: "Beginner", label: "Beginner" },
        { value: "Intermediate", label: "Intermediate" },
        { value: "Advanced", label: "Advanced" },
    ];

    // Course category options
    const courseCategories = [
        { value: 'technology', label: 'Technology & Programming' },
        { value: 'business', label: 'Business & Management' },
        { value: 'data-science', label: 'Data Science & Analytics' },
        { value: 'creative-arts', label: 'Creative Arts & Design' },
        { value: 'health-wellness', label: 'Health & Wellness' },
        { value: 'personal-development', label: 'Personal Development' },
        { value: 'languages', label: 'Languages & Linguistics' },
        { value: 'science-engineering', label: 'Science & Engineering' },
        { value: 'marketing', label: 'Marketing & Communication' },
        { value: 'humanities-social', label: 'Humanities & Social Sciences' },
        { value: 'lifestyle', label: 'Lifestyle' },
        { value: 'teaching-academics', label: 'Teaching & Academics' }
    ];

    return (
        <div onKeyDown={handleEnterButton} id="addCourse" className="md:px-4 lg:px-8 pb-10 w-full xl:border rounded-lg">
            <h3 className="py-5 font-bold text-2xl">Add Course</h3>
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
                        className={`input input-info ${errors.courseName ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                        {...register('courseName', { required: true })}
                    />
                    {errors.courseName && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Image Upload */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Course Thumbnail</span>
                    </label>
                    <div className={`border p-4 rounded-lg ${errors.courseThumbnail ? 'border-red-500' : 'border-base-300'}`}>
                        <div className="w-[425px] h-[255px] border rounded-xl p-4">
                            <img
                                className="w-full h-full object-cover rounded-lg"
                                src={thumbnail || dummyThumbnail}
                                alt="course-thumbnail"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered mt-4 focus:outline-0"
                            {...register('courseThumbnail', { required: true, onChange: handleCourseThumbnail })}
                        />
                    </div>
                    {errors.courseThumbnail && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Short Description */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Short Description</span>
                    </label>
                    <textarea
                        rows="4"
                        placeholder="Short Description"
                        className={`textarea textarea-info ${errors.shortDescription ? 'border-red-500' : 'border-base-300 focus:border-blue-500'} focus:outline-0 resize-none`}
                        {...register('shortDescription', { required: true })}
                    />
                    {errors.shortDescription && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Full Description */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Full Description</span>
                    </label>
                    <textarea
                        rows="5"
                        placeholder="Description"
                        className={`textarea textarea-info ${errors.description ? 'border-red-500' : 'border-base-300 focus:border-blue-500'} focus:outline-0 resize-none`}
                        {...register('description', { required: true })}
                    />
                    {errors.description && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Course Content */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Course Content</span>
                    </label>
                    <div className={`w-full h-full border p-4 rounded-lg ${courseContentError ? 'border-red-500' : ''}`}>
                        <label htmlFor="newMilestone" className="btn bg-blue-600 hover:bg-blue-500 normal-case text-white mb-2">
                            Add Content
                        </label>
                        <AddMilestone setMilestonesData={setMilestonesData} />
                        <MilestoneSection milestonesData={milestonesData} />
                    </div>
                    {courseContentError && <span className="text-red-600">Add at least one module item</span>}
                </div>

                {/* Additional Form Fields */}
                <div className="md:grid grid-cols-2 gap-5 space-y-4 md:space-y-0">
                    {/* Level */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Level</span>
                        </label>
                        <select
                            className="select select-bordered focus:outline-0"
                            {...register('level', { required: true })}
                        >
                            <option disabled defaultValue=''>Select Level</option>
                            {courseLevelOptions.map(level => (
                                <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                        </select>
                        {errors.level && <span className="text-red-600">Field is required</span>}
                    </div>

                    {/* Category */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Category</span>
                        </label>
                        <select
                            className="select select-bordered focus:outline-0"
                            {...register('category', { required: true })}
                        >
                            <option disabled defaultValue=''>Select Category</option>
                            {courseCategories.map(category => (
                                <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                        </select>
                        {errors.category && <span className="text-red-600">Field is required</span>}
                    </div>

                    {/* Seats */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Seats</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Available Seats"
                            className={`input input-info ${errors.seats ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                            {...register('seats', { required: true })}
                        />
                        {errors.seats && <span className="text-red-600">Field is required</span>}
                    </div>

                    {/* Price */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Price</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Class Price"
                            className={`input input-info ${errors.price ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                            {...register('price', { required: true })}
                        />
                        {errors.price && <span className="text-red-600">Field is required</span>}
                    </div>
                </div>

                {/* Submit Button */}
                <input
                    type="submit"
                    value="Add Class"
                    className="btn bg-blue-600 hover:bg-blue-500 text-white normal-case w-full md:w-52"
                    onClick={validateCourseContent}
                />
            </form>
        </div>
    );
};

export default AddClass;
