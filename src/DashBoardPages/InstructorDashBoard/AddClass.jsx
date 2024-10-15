import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import AddMilestone from "./AddMilestone/AddMilestone";
import MilestoneSection from "./AddMilestone/MilestoneSection";
import dummyThumbnail from '../../assets/images/dummyCourseThumbnail.png';
import useUploadImage from "../../hooks/useUploadImage";

const AddClass = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { uploadImage } = useUploadImage();
    const [thumbnail, setThumbnail] = useState(null);
    const [milestonesData, setMilestonesData] = useState([]);
    const [courseContentError, setCourseContentError] = useState(false);
    const [checkCourseContentError, setCheckCourseContentError] = useState(false);
    const [isCoursePublishing, setIsCoursePublishing] = useState(false);

    // Prevent form submission when pressing Enter key. It's used because enter button trigger the submit button when adding course contents items.
    const handleEnterButton = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleCourseThumbnail = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setThumbnail(URL.createObjectURL(file));
        }
        else if (!file) {
            setThumbnail(null);
        }
        else {
            alert('Please select a valid image file.');
        }
    };

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


    // Course level options
    const courseLevelOptions = [
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
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

    // Handle form submission
    const onSubmit = async (data) => {
        const { courseName, courseThumbnail, summary, description, level, category, seats, price } = data;
        if (courseContentError) return;
        setIsCoursePublishing(true)

        const { uid } = user;
        const uploadedThumbnail = await uploadImage(courseThumbnail[0]);

        const newClass = {
            _instructorId: uid,
            courseName,
            courseThumbnail: uploadedThumbnail,
            summary,
            description,
            level,
            category,
            seats: parseInt(seats),
            price: parseFloat(price),
            discount: 0,
            courseContents: milestonesData,
            publish: true
        };

        axiosSecure.post('http://localhost:5000/api/v1/course/add', newClass).then(res => {
            if (res.data.result.insertedId) {
                resetForm();
                showSuccessMessage();
                setIsCoursePublishing(false);
            }
        });
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

    return (
        <div onKeyDown={handleEnterButton} id="addCourse" className="md:px-4 lg:px-8 py-10 w-full xl:border rounded-lg">
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
                    <div className={`border p-2 sm:p-4 rounded-lg ${errors.courseThumbnail ? 'border-red-500' : 'border-base-300'}`}>
                        <p className="font-medium mb-2">Image Preview</p>
                        <div className="sm:w-[26rem] sm:h-[16rem] border rounded-xl sm:p-4">
                            <img
                                className="w-full h-full object-cover rounded-lg"
                                src={thumbnail || dummyThumbnail}
                                alt="course-thumbnail"
                            />
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="file-input file-input-bordered mt-4 w-full focus:outline-0"
                            {...register('courseThumbnail', { required: true, onChange: handleCourseThumbnail })}
                        />
                    </div>
                    {errors.courseThumbnail && <span className="text-red-600">Field is required</span>}
                </div>

                {/* summury*/}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Summary</span>
                    </label>
                    <textarea
                        rows="4"
                        placeholder="summary"
                        className={`textarea textarea-info ${errors.summary ? 'border-red-500' : 'border-base-300 focus:border-blue-500'} focus:outline-0 resize-none`}
                        {...register('summary', { required: true })}
                    />
                    {errors.summary && <span className="text-red-600">Field is required</span>}
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
                    <div className={`w-full h-full border ${courseContentError ? 'border-red-500' : ''} p-2 sm:p-4 rounded-lg`}>
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
                    {courseContentError && <span className="text-red-600">Add at least one module item</span>}
                </div>

                <div className="md:grid grid-cols-2 gap-5 space-y-4 md:space-y-0">
                    {/* Level */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Level</span>
                        </label>
                        <select
                            defaultValue=''
                            className={`select select-bordered ${errors.level ? 'border-red-500' : "focus:border-blue-500"} focus:outline-0`}
                            {...register('level', { required: true })}
                        >
                            <option disabled value=''>Select Level</option>
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
                            defaultValue=''
                            className={`select select-bordered ${errors.category ? 'border-red-500' : "focus:border-blue-500"} focus:outline-0`}
                            {...register('category', { required: true })}
                        >
                            <option disabled value=''>Select Category</option>
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
                            <span className="label-text">Price $</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Course Price"
                            className={`input input-info ${errors.price ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                            {...register('price', { required: true })}
                        />
                        {errors.price && <span className="text-red-600">Field is required</span>}
                    </div>
                </div>

                {/* Submit Button */}
                <input
                    disabled={isCoursePublishing}
                    type="submit"
                    value={`${isCoursePublishing ? 'Publishing...' : 'Publish'}`}
                    className="btn bg-blue-600 hover:bg-blue-500 text-white normal-case w-full md:w-52 mt-[2rem!important]"
                    onClick={validateCourseContent}
                />
            </form >
        </div >
    );
};

export default AddClass;
