import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dummyImg from '../../../assets/icon/user_icon.png';
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useLottie } from "lottie-react";
import loadingAnimation from '../../../assets/loadingAnimation/loading3.json';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import useUserRole from "../../../hooks/useUserRole";
const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const Profile = () => {
    // React Hook Form setup
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();

    // Custom hooks for authentication and secure axios instance
    const { user, updateUser, updateUserPassword, reAuthenticateUser, EmailAuthProvider } = useAuth();
    const [axiosSecure] = useAxiosSecure();

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

    // Image hosting URL
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_secret_key}`;

    // Fetch user data using react-query
    const { data: userData = {} } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`https://learning-info-bd.vercel.app/user/${user?.email}`);
            return res.data;
        }
    });

    // Handle profile image change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImg(URL.createObjectURL(file));
        } else {
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
        const name = form.name.value;
        const image = form.profileImg.files;
        const formData = new FormData();
        formData.append('image', image[0]);

        // If a new image is provided, upload it
        if (image[0]) {
            await fetch(img_hosting_url, {
                method: 'post',
                body: formData
            })
                .then(res => res.json())
                .then(async (data) => {
                    if (data.success) {
                        const newName = name || user?.displayName;
                        const imgUrl = data.data.display_url;
                        await updateUser(newName, imgUrl);
                        axiosSecure.patch(`https://learning-info-bd.vercel.app/updateUser/${userData?._id}`, { name: newName || user?.displayName || 'anonymous', image: imgUrl })
                            .then(res => {
                                if (res.data.modifiedCount) {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Profile Update Successfully',
                                        showConfirmButton: false,
                                        timer: 2000
                                    });
                                }
                            });
                    }
                });
        } else { // If no new image, update profile with existing data
            await updateUser(name, user?.photoURL);
            axiosSecure.patch(`https://learning-info-bd.vercel.app/updateUser/${userData?._id}`, { name: name || 'anonymous', image: user?.photoURL })
                .then(res => {
                    if (res.data.modifiedCount) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Profile Update Successfully',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                });
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

    // loading animation
    const options = {
        animationData: loadingAnimation,
        loop: true,

    };
    const { View } = useLottie(options);

    return (
        <>
            {
                !user
                    ?
                    <div className="w-full h-[500px] flex flex-col justify-center items-center">
                        <div className="w-40">
                            {View}
                        </div>
                        <span className="mx-auto">
                            loading...
                        </span>
                    </div>
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
                            userRole === 'instructor' &&
                            <AdditionalInfo />
                        }
                    </div>
            }
        </>
    );
};

const AdditionalInfo = () => {
    const { register, handleSubmit, watch, reset } = useForm();

    // Language Options
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

    const [selectedLanguage, setSelectedLanguage] = useState(null);

    // Add areas of expertise options
    const [areasOfExpertise, setAreasOfExpertise] = useState(null);
    console.log(areasOfExpertise);
    

    const handleAdditionalInfo = (data) => {
        const { headline, website, Xprofile, youtubeProfile, facebookProfile } = data;
        const languages = selectedLanguage?.map(language => language.value) || '';
    }
    return (
        <div>
            <h3 className="text-xl font-medium mb-3">Addtional Info</h3>
            <form onSubmit={handleSubmit(handleAdditionalInfo)} className="sm:grid grid-cols-2 gap-5 space-y-4 sm:space-y-0">
                {/* Headline field */}
                <div>
                    <label className="label">Headline</label>
                    <input
                        type="text"
                        placeholder="Add Headline"
                        className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        autoComplete="off"
                        {...register('headline')}
                    />
                </div>

                {/* Language field */}
                <div>
                    <label className="label">Language</label>
                    <Select
                        isMulti
                        name="language"
                        options={languageOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select Language"
                        defaultValue={selectedLanguage}
                        onChange={setSelectedLanguage}
                    />
                </div>

                {/* Description field */}
                <div className="col-span-2">
                    <label className="label">Description</label>
                    <textarea
                        rows="5"
                        placeholder="Descripton"
                        className="textarea textarea-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0 resize-none"
                        autoComplete="off"
                        {...register('description')}
                    />
                </div>

                {/* Areas of Expertise field */}
                <div className="col-span-2">
                    <label className="label">Areas Of Expertise</label>
                    <CreatableSelect
                        isMulti
                        name="expertise"                        
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Add"
                        defaultValue={areasOfExpertise}
                        onChange={setAreasOfExpertise}
                    />
                </div>

                {/* Experience field */}
                <div className="col-span-2">
                    <label className="label">Professional Experience</label>
                    <textarea
                        rows="5"
                        placeholder="Add your professional experience"
                        className="textarea textarea-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0 resize-none"
                        autoComplete="off"
                        {...register('experience')}
                    />
                </div>

                {/* Links */}
                <div className="col-span-2 border rounded-lg px-2 sm:px-4 py-2 sm:py-6">
                    <label className="label text-lg font-medium">Links</label>
                    <div>
                        <label className="label">Website</label>
                        <input
                            type="text"
                            placeholder="website link"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            {...register('website')}
                        />
                    </div>

                    <div>
                        <label className="label">X(Formerly twitter)</label>
                        <input
                            type="text"
                            placeholder="add X profile"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            {...register('Xprofile')}
                        />
                    </div>

                    <div>
                        <label className="label">Linkdin</label>
                        <input
                            type="text"
                            placeholder="add linkedin profile"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            {...register('linkedinProfile')}
                        />
                    </div>

                    <div>
                        <label className="label">Youtube</label>
                        <input
                            type="text"
                            placeholder="add channel link"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            {...register('youtubeProfile')}
                        />
                    </div>

                    <div>
                        <label className="label">Facebook</label>
                        <input
                            type="text"
                            placeholder="add facebook profile"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            {...register('facebookProfile')}
                        />
                    </div>
                </div>
                <input
                    type="submit"
                    className="col-span-2 btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end"
                    value="Update Info"
                    disabled={false}
                />
            </form>
        </div>
    )
}
export default Profile;
