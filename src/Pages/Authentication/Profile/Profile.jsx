import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dummyImg from '../../../assets/icon/user_icon.png';
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useUserRole from "../../../hooks/useUserRole";
import Loading from "../../../components/Loading/Loading";
import useUploadImage from "../../../hooks/useUploadImage";

const Profile = () => {
    // React Hook Form setup
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    // Custom hooks for authentication, image upload and secure axios instance
    const { user, loading, updateUser, updateUserPassword, reAuthenticateUser, EmailAuthProvider } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { uploadImage } = useUploadImage();

    // Custom hooks to get user role
    const [userRole] = useUserRole();

    // State variables
    const [name, setName] = useState('');
    const [img, setImg] = useState(null);
    const fileInputRef = useRef(null);
    const [profileUpdateDisable, setProfileUpdateDisable] = useState(true);
    const [passwordUpdateDisable, setPasswordUpdateDisable] = useState(true);
    const [confirmError, setConfirmError] = useState(false);
    const [isPasswordProvider, setPasswordProvider] = useState(false);


    // Fetch user data using react-query
    const { data: userData = {} } = useQuery({
        queryKey: ['user', user?.uid],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/api/v1/user/get/${user?.uid}`);
            return res.data;
        }
    });

    // Handle profile image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImg(URL.createObjectURL(file));
        }
        else if (!file) {
            setImg(null);
        }
        else {
            alert('Please select a valid image file.');
        }
    };

    // Trigger file input click for image upload
    const handleAddImage = () => {
        fileInputRef.current.click();
    };

    // Reset profile input fields
    const resetProfileInputField = () => {
        setName('');
        setImg(null);
        fileInputRef.current.value = '';
    };

    // Handle profile update
    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value || user?.displayName;
        const image = await uploadImage(form.profileImg.files[0]) || user?.photoURL;

        try {
            await updateUser(name, image);
            axiosSecure.patch(`http://localhost:5000/api/v1/user/update/${user?.uid}`, { name, image })
                .then(res => {
                    if (res.data.result.modifiedCount) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Profile Update Successfully',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                });
        } catch (error) {
            console.log("Something went wrong while updating profile data:", error);

        }

        form.reset();
        resetProfileInputField();
    };

    // Enable or disable profile update button based on input changes
    useEffect(() => {
        if ((name && (name !== user?.displayName)) || img) {
            setProfileUpdateDisable(false);
        } else {
            setProfileUpdateDisable(true);
        }
    }, [name, img, user?.displayName]);

    // Handle password update
    const changePassword = (data) => {
        const { currentPassword, newPassword } = data;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        reAuthenticateUser(credential)
            .then(() => {
                updateUserPassword(newPassword)
                    .then(() => {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Password update successfully',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        reset();
                    })
                    .catch((error) => {
                        console.error('Something went wrong in updateUserPassword', error);
                    });
            })
            .catch((error) => {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Wrong current passowrd!',
                    showConfirmButton: false,
                    showCloseButton: true
                });
                console.error("Something went wrong in re-authentication", error);
            });
    };

    // Validate and enable/disable password update button based on confirmation
    const handleConfirmPassword = (data) => {
        const { newPassword, confirmNewPassword } = data;
        setConfirmError(false);
        if (newPassword && confirmNewPassword.length >= 6) {
            if (newPassword === confirmNewPassword) {
                setPasswordUpdateDisable(false);
                setConfirmError(false);
            } else {
                setPasswordUpdateDisable(true);
                setConfirmError(true);
            }
        }
    };

    // Check if the user is using a password provider for authentication
    useEffect(() => {
        if (user?.providerData[0].providerId === 'password') {
            setPasswordProvider(true);
        } else {
            setPasswordProvider(false);
        }
    }, [user]);

    return (
        <>
            {
                !user
                    ?
                    <Loading />
                    :
                    <div className="lg-container sm:border px-0 sm:px-4 md:px-6 py-6 lg:px-10 lg:py-10 rounded-2xl space-y-10">
                        {/* Profile general section */}
                        <div>
                            <h3 className="text-xl font-medium mb-3">My Profile</h3>
                            <form onSubmit={handleUpdateProfile} className="grid sm:grid-cols-2 gap-x-5 gap-y-4 sm:gap-y-8">
                                {/* Name field */}
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        placeholder="Name"
                                        name="name"
                                        className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                        defaultValue={user?.displayName}
                                        autoComplete="off"
                                        required
                                    />
                                </div>

                                {/* Email field */}
                                <div>
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        disabled
                                        className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                    />
                                </div>

                                {/* Image change */}
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        name="profileImg"
                                        className="hidden"
                                    />
                                    <img
                                        className="w-16 h-16 bg-white rounded-full object-cover drop-shadow-lg"
                                        src={img || user?.photoURL || dummyImg}
                                        alt="profile picture"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddImage}
                                        className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        {user?.photoURL ? 'Change Profile Image' : 'Add Profile Image'}
                                    </button>
                                </div>

                                <input
                                    type="submit"
                                    className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] sm:justify-self-end my-auto"
                                    value="Update Profile"
                                    disabled={profileUpdateDisable}
                                />
                            </form>
                        </div>

                        {/* Password change section */}
                        {isPasswordProvider && (
                            <div>
                                <h3 className="text-xl font-medium mb-3">Password</h3>
                                <form onSubmit={handleSubmit(changePassword)} className="sm:grid grid-cols-2 gap-x-5 gap-y-8 space-y-4 sm:space-y-0">
                                    {/* Current password input field */}
                                    <div className="col-span-2">
                                        <label className="label">Current Password</label>
                                        <input
                                            type="password"
                                            placeholder="Current Password"
                                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                            autoComplete="off"
                                            {...register("currentPassword", { required: true })}
                                        />
                                        {errors.currentPassword?.type === 'required' && <span className="text-red-600">Current password is required</span>}
                                    </div>

                                    {/* New password input field */}
                                    <div>
                                        <label className="label">New Password</label>
                                        <input
                                            type="text"
                                            placeholder="New Password"
                                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                            autoComplete="off"
                                            {...register("newPassword", {
                                                required: true,
                                                minLength: 6,
                                                pattern: /(?=.*[A-Z])(?=.*[!@#$&*.])/
                                            })}
                                        />
                                        {errors.newPassword?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                        {((errors.newPassword?.type === 'minLength') || (errors.newPassword?.type === 'pattern')) && <span className="text-red-600">* New Password must be at least 6 characters long and contain at least one uppercase letter and a special character!</span>}
                                    </div>

                                    {/* Confirm new password input field */}
                                    <div>
                                        <label className="label">Confirm New Password</label>
                                        <input
                                            onChange={watch(handleConfirmPassword)}
                                            type="password"
                                            placeholder="Confirm New Password"
                                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                            autoComplete="off"
                                            {...register("confirmNewPassword", { required: true })}
                                        />
                                        {errors.confirmNewPassword?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                        {confirmError && <span className="text-red-600">The password and confirmation password do not match.</span>}
                                    </div>

                                    <input
                                        type="submit"
                                        className="col-span-2 btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end mt-4"
                                        value="Update Password"
                                        disabled={passwordUpdateDisable}
                                    />
                                </form>
                            </div>
                        )}

                        {/* Add additonal info */}
                        {
                            userData && userRole === 'instructor' &&
                            <AdditionalInfo
                                axiosSecure={axiosSecure}
                                user={userData}
                            />
                        }
                    </div>
            }
        </>
    );
};

const AdditionalInfo = ({ axiosSecure, user }) => {  
    const { register, handleSubmit } = useForm();

    // Language options available for selection
    const languageOptions = [
        { value: 'English', label: 'English' },
        { value: 'Spanish', label: 'Spanish' },
        { value: 'French', label: 'French' },
        { value: 'German', label: 'German' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Japanese', label: 'Japanese' },
        { value: 'Arabic', label: 'Arabic' },
        { value: 'Portuguese', label: 'Portuguese' },
        { value: 'Russian', label: 'Russian' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Bengali', label: 'Bengali' },
        { value: 'Korean', label: 'Korean' },
        { value: 'Italian', label: 'Italian' },
        { value: 'Dutch', label: 'Dutch' },
        { value: 'Turkish', label: 'Turkish' }
    ];

    // Local state management
    const [formData, setFormData] = useState(user);
    const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState(true);
    const { headline, bioData, experience, website, Xprofile, linkedinProfile, youtubeProfile, facebookProfile, languages, expertise } = formData;

    // Set default options for language and expertise selection
    const selectedLanguageOptions = languages?.map(language => languageOptions.find(option => option.value === language)) || [];
    const selectedExpertiseOptions = expertise?.map(value => ({ value, label: value })) || [];

    const [bioDataValue, setBioDataValue] = useState(bioData);
    const [experienceInputValue, setExperienceInputValue] = useState(experience);
    const [isBioDataMaxLengthReached, setIsBioDataMaxLengthReached] = useState(false);
    const [isExperienceMaxLengthReached, setIsExperienceMaxLengthReached] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState(selectedLanguageOptions);
    const [areasOfExpertise, setAreasOfExpertise] = useState(selectedExpertiseOptions);

    const languageSelection = selectedLanguage?.map(language => language.value) || [];
    const expertiseSelection = areasOfExpertise?.map(expertise => expertise.value) || [];

    // Handle input change for general form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle selection changes (languages & expertise)
    const handleArrayChange = (name, value) => {
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    // Handle bioData input with max length control
    const handleBioDataChange = (e) => {
        const { value } = e.target;
        if (!isBioDataMaxLengthReached || value?.length <= bioDataValue?.length) {
            setBioDataValue(value);
            setIsBioDataMaxLengthReached(value?.length > 500);
        }
    };

    // Handle experience input with max length control
    const handleExperienceDataChange = (e) => {
        const { value } = e.target;
        if (!isExperienceMaxLengthReached || value?.length <= experienceInputValue?.length) {
            setExperienceInputValue(value);
            setIsExperienceMaxLengthReached(value?.length > 500);
        }
    };

    //handle BioData input
    const handleBioDataInput = (e) => {
        handleInputChange(e);
        handleBioDataChange(e);
    }

    //handle BioData input
    const handleExperienceDataInput = (e) => {
        handleInputChange(e);
        handleExperienceDataChange(e);
    }

    // Handle form submission
    const handleAdditionalInfo = (data) => {
        const payload = {
            ...data,
            bioData: bioDataValue,
            experience: experienceInputValue,
            languages: languageSelection,
            expertise: expertiseSelection
        };

        axiosSecure.patch(`http://localhost:5000/api/v1/user/updateInstructorProfile/${user?._id}`, payload)
            .then(res => {
                if (res.data.result.modifiedCount) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Profile Updated Successfully',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    setIsUpdateBtnDisabled(true);
                }
            });
    };

    // Check if form data has changed to enable/disable update button
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(user);
        setIsUpdateBtnDisabled(!hasChanges);
    }, [formData, user]);    
    return (
        <div>
            <h3 className="text-xl font-medium mb-3">Additional Info</h3>
            <form onSubmit={handleSubmit(handleAdditionalInfo)} className="sm:grid grid-cols-2 gap-5 space-y-4 sm:space-y-0">

                {/* Headline field */}
                <div className="col-span-2 md:col-span-1">
                    <label className="label">Headline</label>
                    <input
                        value={headline}
                        type="text"
                        placeholder="Ex: Software Engineer"
                        className="input input-info w-full border-base-300 focus:border-blue-500 focus:outline-0"
                        autoComplete="off"
                        {...register('headline', { onChange: handleInputChange })}
                    />
                </div>

                {/* Language field */}
                <div className="col-span-2 md:col-span-1">
                    <label className="label">Language</label>
                    <Select
                        isMulti
                        options={languageOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select Language"
                        defaultValue={selectedLanguage}
                        onChange={value => {
                            setSelectedLanguage(value);
                            handleArrayChange('languages', value.map(item => item.value));
                        }}
                    />
                </div>

                {/* Bio Data field */}
                <div className="col-span-2">
                    <label className="label">Write About Yourself</label>
                    <div className="relative">
                        <textarea
                            rows="6"
                            placeholder="Type here..."
                            className={`textarea textarea-info w-full ${isBioDataMaxLengthReached ? 'border-red-600' : 'border-base-300'} focus:border-blue-500 focus:outline-0 resize-none`}
                            value={bioDataValue}
                            {...register('bioData', { maxLength: 500, onChange: handleBioDataInput })}
                        />
                        <span className={`absolute bottom-4 right-4 text-xs ${isBioDataMaxLengthReached ? 'text-red-600' : 'text-gray-600'}`}>
                            {bioDataValue?.length || 0} / 500
                        </span>
                    </div>
                    {isBioDataMaxLengthReached && <span className="text-red-600">You have reached the maximum character limit.</span>}
                </div>

                {/* Expertise field */}
                <div className="col-span-2">
                    <label className="label">Areas of Expertise</label>
                    <CreatableSelect
                        isMulti
                        classNamePrefix="select"
                        placeholder="Ex: Problem Solving"
                        defaultValue={areasOfExpertise}
                        onChange={value => {
                            setAreasOfExpertise(value);
                            handleArrayChange('expertise', value.map(item => item.value));
                        }}
                    />
                </div>

                {/* Experience field */}
                <div className="col-span-2">
                    <label className="label">Professional Experience</label>
                    <div className="relative">
                        <textarea
                            rows="6"
                            placeholder="Add your professional experience"
                            className={`textarea textarea-info w-full ${isExperienceMaxLengthReached ? 'border-red-600' : 'border-base-300'} focus:border-blue-500 focus:outline-0 resize-none`}
                            value={experienceInputValue}
                            {...register('experience', { maxLength: 500, onChange: handleExperienceDataInput })}
                        />
                        <span className={`absolute bottom-4 right-4 text-xs ${isExperienceMaxLengthReached ? 'text-red-600' : 'text-gray-600'}`}>
                            {experienceInputValue?.length || 0} / 500
                        </span>
                    </div>
                    {isExperienceMaxLengthReached && <span className="text-red-600">You have reached the maximum character limit.</span>}
                </div>

                {/* Links */}
                <div className="col-span-2 border rounded-lg px-2 sm:px-4 py-2 sm:py-6">
                    <label className="label text-lg font-medium">Links</label>

                    {/* Website */}
                    <InputField
                        label="Website"
                        value={website}
                        placeholder="Website link"
                        register={register}
                        name="website"
                        handleInputChange={handleInputChange}
                    />

                    {/* X profile */}
                    <InputField
                        label="X (Formerly Twitter)"
                        value={Xprofile}
                        placeholder="X profile"
                        register={register}
                        name="Xprofile"
                        handleInputChange={handleInputChange}
                    />

                    {/* LinkedIn */}
                    <InputField
                        label="LinkedIn"
                        value={linkedinProfile}
                        placeholder="LinkedIn profile"
                        register={register}
                        name="linkedinProfile"
                        handleInputChange={handleInputChange}
                    />

                    {/* YouTube */}
                    <InputField
                        label="YouTube"
                        value={youtubeProfile}
                        placeholder="YouTube channel link"
                        register={register}
                        name="youtubeProfile"
                        handleInputChange={handleInputChange}
                    />

                    {/* Facebook */}
                    <InputField
                        label="Facebook"
                        value={facebookProfile}
                        placeholder="Facebook profile"
                        register={register}
                        name="facebookProfile"
                        handleInputChange={handleInputChange}
                    />
                </div>

                {/* Submit button */}
                <input
                    type="submit"
                    className="col-span-2 btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end"
                    value="Update Info"
                    disabled={isUpdateBtnDisabled}
                />
            </form>
        </div>
    );
};

// Reusable InputField component
const InputField = ({ label, value, placeholder, register, name, handleInputChange }) => (
    <div>
        <label className="label">{label}</label>
        <input
            value={value}
            type="text"
            placeholder={placeholder}
            className="input input-info w-full border-base-300 focus:border-blue-500 focus:outline-0"
            autoComplete="off"
            {...register(name, { onChange: handleInputChange })}
        />
    </div>
);

export default Profile;
