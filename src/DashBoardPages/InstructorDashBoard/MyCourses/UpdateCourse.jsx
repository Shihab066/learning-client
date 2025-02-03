import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import MilestoneSection from "../AddMilestone/MilestoneSection";
import AddMilestone from "../AddMilestone/AddMilestone";
import dummyThumbnail from '../../../assets/images/dummyCourseThumbnail.png';
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading/Loading";
import useUploadImage from "../../../hooks/useUploadImage";
import generateImageLink from "../../../utils/generateImageLink";
import useAuth from "../../../hooks/useAuth";

const UpdateCourse = ({ setIsUpdateCourseOpen, courseId, setCourseId, refetchCourses }) => {

    const { user } = useAuth();
    const { data: course, refetch, isLoading } = useQuery({
        queryKey: ['course', courseId, user],
        queryFn: async () => {
            const res = await axiosSecure.get(`/course/instructorCourse?id=${user?.uid}&courseId=${courseId}`);
            return res.data;
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [formData, setFormData] = useState(course);
    const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState(true);
    const [axiosSecure] = useAxiosSecure();
    const { uploadImage } = useUploadImage();
    const [thumbnail, setThumbnail] = useState(null);
    const [courseContentError, setCourseContentError] = useState(false);
    const [checkCourseContentError, setCheckCourseContentError] = useState(false);
    const { courseName, courseThumbnail, summary, description, courseContents, level, category, seats, price, discount } = formData || {};
    const [milestonesData, setMilestonesData] = useState(courseContents);
    const { setCourseId: setCurrentCourseId } = useAuth();

    // Handle input change for general form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleNumberInput = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value && parseFloat(value) }));
    }

    useEffect(() => {
        setFormData(prevData => ({ ...prevData, courseContents: milestonesData }));
    }, [milestonesData])

    useEffect(() => {
        setFormData(course)
    }, [course])

    // Check if form data has changed to enable/disable update button
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(course);
        setIsUpdateBtnDisabled(!hasChanges);
        setMilestonesData(formData?.courseContents)
    }, [formData]);


    // Prevent form submission when pressing Enter key. It's used because enter button trigger the submit button when adding course contents items.
    const handleEnterButton = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };

    const handleCourseThumbnail = (event) => {
        setFormData(prevData => ({ ...prevData, courseThumbnail: event.target.files[0] || course?.courseThumbnail }))
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

    const resetImagePreview = () => {
        setThumbnail(null);
        reset({ courseThumbnail: '' })
        setFormData(prevData => ({ ...prevData, courseThumbnail: course?.courseThumbnail }))
    }

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

    // Calculate Total Modules
    const totalModules = milestonesData?.map(({ milestoneModules }) => milestoneModules.length).reduce((acc, curr) => acc + curr, 0);

    // Calculate Total Videoes
    const totalVideos = milestonesData?.reduce((totalItems, { milestoneModules }) => {
        const moduleItemsCount = milestoneModules.reduce((moduleTotal, { moduleItems }) => {
            const itemsCount = moduleItems.length; // Count the number of items
            return moduleTotal + itemsCount;
        }, 0);
        return totalItems + moduleItemsCount;
    }, 0) ?? 0;

    // Calculate Course Duration
    const totalCourseDuration = milestonesData?.reduce((totalDuration, { milestoneModules }) => {
        const moduleDuration = milestoneModules.reduce((moduleTotal, { moduleItems }) => {
            const itemsDuration = moduleItems.reduce((itemTotal, { duration }) => itemTotal + (duration || 0), 0);
            return moduleTotal + itemsDuration;
        }, 0);
        return totalDuration + moduleDuration;
    }, 0) ?? 0;

    // Handle form submission
    const onSubmit = async (data) => {
        const { courseThumbnail, seats, price, discount } = data;

        if (courseContentError) return;

        const uploadedThumbnail = await uploadImage(courseThumbnail[0]);

        const updatedCourse = {
            ...data,
            courseThumbnail: uploadedThumbnail || course?.courseThumbnail,
            seats: parseInt(seats),
            price: parseFloat(price),
            discount: parseFloat(discount) || 0,
            courseContents: milestonesData,
            courseDuration: totalCourseDuration,
            totalModules,
            totalVideos
        };

        axiosSecure.patch(`/course/update?${courseId}`, updatedCourse).then(res => {
            if (res.data.result.modifiedCount) {
                resetForm();
                showSuccessMessage();
                refetch();
                refetchCourses();
            }
        });
    };

    const resetForm = () => {
        setThumbnail(null);
        setCheckCourseContentError(false);
        reset();
    };

    const showSuccessMessage = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Course Update Successfully',
            showConfirmButton: false,
            timer: 2000
        });
    };

    // Set CourseId to the context API.
    // Note: This CourseId is used during video upload.
    // When a user fetches the video URL, it can be used to verify if the user is enrolled in the course.
    const courseIdRef = useRef(true);
    useEffect(() => {
        if (courseIdRef.current) {
            setCurrentCourseId(courseId);
            courseIdRef.current = false;
        }

        return () => {
            courseIdRef.current = true;
            if (courseIdRef.current) {
                setCurrentCourseId(null)
            }
        }
    }, [])

    console.log();


    return (
        <>
            {
                (!isLoading && formData && milestonesData)
                    ?
                    <div onKeyDown={handleEnterButton} id="addCourse" className={`px-0 xl:px-8 pb-10 w-full xl:border rounded-lg relative ${isLoading ? 'hidden' : 'block'}`}>
                        <h3 className="py-2 md:py-5 font-bold text-xl">Update Course</h3>
                        <button
                            onClick={() => {
                                setIsUpdateCourseOpen(false)
                                setCourseId('')
                            }}
                            className="btn btn-sm btn-circle btn-ghost bg-base-300 absolute top-0 right-0 sm:top-2 sm:right-2 xl:right-4 xl:top-4">✕</button>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">

                            {/* Class Name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Class Name</span>
                                </label>
                                <input
                                    value={courseName}
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Class Name"
                                    className={`input input-info ${errors.courseName ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                                    {...register('courseName', { required: true, onChange: handleInputChange })}
                                />
                                {errors.courseName && <span className="text-red-600">Field is required</span>}
                            </div>

                            {/* Image Upload */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Course Thumbnail</span>
                                </label>
                                <div className={`border p-2 sm:p-4 rounded-lg`}>
                                    <p className="font-medium mb-2">Image Preview</p>
                                    <div className="sm:w-[26rem] sm:h-[16rem] border rounded-xl sm:p-4 relative">
                                        <img
                                            className="w-full h-full object-cover rounded-lg"
                                            src={thumbnail || generateImageLink({ imageId: courseThumbnail }) || dummyThumbnail}
                                            alt="course-thumbnail"
                                        />
                                        {
                                            thumbnail &&
                                            <div
                                                onClick={resetImagePreview}
                                                className="btn btn-xs btn-circle bg-red-500 hover:bg-red-700 text-white absolute -right-2 -top-2 text-sm"
                                                title="Reset Image"
                                            >
                                                ✕
                                            </div>
                                        }
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-sm sm:file-input-md file-input-bordered mt-4 w-full focus:outline-0"
                                        {...register('courseThumbnail', { onChange: handleCourseThumbnail })}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Summary</span>
                                </label>
                                <textarea
                                    value={summary}
                                    rows="4"
                                    placeholder="Summary"
                                    className={`textarea textarea-info ${errors.summary ? 'border-red-500' : 'border-base-300 focus:border-blue-500'} focus:outline-0 resize-none`}
                                    {...register('summary', { required: true, onChange: handleInputChange })}
                                />
                                {errors.summary && <span className="text-red-600">Field is required</span>}
                            </div>

                            {/* Full Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Full Description</span>
                                </label>
                                <textarea
                                    value={description}
                                    rows="5"
                                    placeholder="Description"
                                    className={`textarea textarea-info ${errors.description ? 'border-red-500' : 'border-base-300 focus:border-blue-500'} focus:outline-0 resize-none`}
                                    {...register('description', { required: true, onChange: handleInputChange })}
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
                                        {milestonesData?.map((milestone) => (
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
                                        defaultValue={level}
                                        className={`select select-bordered ${errors.level ? 'border-red-500' : "focus:border-blue-500"} focus:outline-0`}
                                        {...register('level', { required: true, onChange: handleInputChange })}
                                    >
                                        <option disabled value=''>Select Level</option>
                                        {courseLevelOptions?.map(level => (
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
                                        defaultValue={category}
                                        className={`select select-bordered ${errors.category ? 'border-red-500' : "focus:border-blue-500"} focus:outline-0`}
                                        {...register('category', { required: true, onChange: handleInputChange })}
                                    >
                                        <option disabled value=''>Select Category</option>
                                        {courseCategories?.map(category => (
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
                                        value={seats}
                                        type="number"
                                        placeholder="Available Seats"
                                        className={`input input-info ${errors.seats ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                                        {...register('seats', {
                                            required: true, min: 0, onChange: handleNumberInput, validate: {
                                                isInteger: (value) => {
                                                    Number.isInteger(Number(value))
                                                }
                                            },
                                        })}
                                    />
                                    {errors.seats?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                    {errors.seats?.type === 'min' && <span className="text-red-600">Seats must be a positive</span>}
                                </div>

                                {/* Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Price $</span>
                                    </label>
                                    <input
                                        value={price}
                                        type="number"
                                        placeholder="Course Price"
                                        className={`input input-info ${errors.price ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                                        {...register('price', { required: true, min: 0, onChange: handleNumberInput })}
                                    />
                                    {errors.price?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                    {errors.price?.type === 'min' && <span className="text-red-600">Price must be a positive</span>}
                                </div>

                                {/* Discount */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Discount %</span>
                                    </label>
                                    <input
                                        value={discount}
                                        type="number"
                                        placeholder="Discount %"
                                        className={`input input-info ${errors.discount?.type === 'min' ? 'border-red-500' : "border-base-300 focus:border-blue-500"} focus:outline-0`}
                                        {...register('discount', { min: 0, max: 100, onChange: handleNumberInput })}
                                    />
                                    {errors.discount?.type === 'min' && <span className="text-red-600">Discount must be a positive</span>}
                                    {errors.discount?.type === 'max' && <span className="text-red-600">Discount must be less or equal to 100</span>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <input
                                type="submit"
                                value="Save Change"
                                className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case w-full md:w-52 mt-[2rem!important]"
                                onClick={validateCourseContent}
                                disabled={isUpdateBtnDisabled}
                            />
                        </form >
                    </div >
                    : <Loading />
            }
        </>
    );
};

export default UpdateCourse;
