import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import dummyImg from '../../assets/icon/user_icon.png'
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [name, setName] = useState('');
    const [img, setImg] = useState(null);
    const fileInputRef = useRef(null);
    const [profileUpdateDisable, setProfileUpdateDisable] = useState(true);
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_secret_key}`;


    const { data: userData = {} } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`https://learning-info-bd.vercel.app/user/${user?.email}`);
            return res.data;
        }
    })

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImg(URL.createObjectURL(file));
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleAddImage = () => {
        fileInputRef.current.click();
    };

    const resetProfileInputField = () => {
        setName('')
        setImg(null);
        fileInputRef.current.value = '';
    };


    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        const form = event.target;
        const name = form.name.value;
        const image = form.profileImg.files;
        const formData = new FormData();
        formData.append('image', image[0]);        

        {
            image[0] &&
                await fetch(img_hosting_url, {
                    method: 'post',
                    body: formData
                })
                    .then(res => res.json())
                    .then(async (data) => {
                        if (data.success) {
                            const newName = name || user?.displayName;
                            const imgUrl = data.data.display_url;
                            await updateUser(newName, imgUrl)
                                .then(() => {
                                    axiosSecure.patch(`https://learning-info-bd.vercel.app/updateUser/${userData?._id}`, { name: newName || user?.displayName || 'anonymous', image: imgUrl })
                                        .then(res => {
                                            if (res.data.modifiedCount) {
                                                Swal.fire({
                                                    position: 'center',
                                                    icon: 'success',
                                                    title: 'Profile Update Successfully',
                                                    showConfirmButton: false,
                                                    timer: 2000
                                                })
                                            }
                                        })
                                })
                        }
                    })
        }

        {
            !image[0] &&
                await updateUser(name, user?.photoURL)
                    .then(() => {
                        axiosSecure.patch(`https://learning-info-bd.vercel.app/updateUser/${userData?._id}`, { name: name || 'anonymous', image: user?.photoURL })
                            .then(res => {
                                if (res.data.modifiedCount) {
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Profile Update Successfully',
                                        showConfirmButton: false,
                                        timer: 2000
                                    })
                                }
                            })
                    })
        }
        form.reset();
        resetProfileInputField();
    }

    useEffect(() => {
        if ((name && (name !== user?.displayName)) || img) {
            setProfileUpdateDisable(false);
        } else {
            setProfileUpdateDisable(true)
        }
    }, [name, img, user?.displayName]);

    return (
        <div className="mt-10">
            <div className="lg-container bg-indigo-50 drop-shadow-md px-20 py-20 rounded-2xl">
                {/* Profile general section*/}
                <h3 className="text-xl font-medium mb-3">My Profile</h3>
                <form
                    onSubmit={handleUpdateProfile}
                    className="grid grid-cols-2 gap-x-5 gap-y-8 mb-16">
                    {/* Name field */}
                    <div>
                        <label className="label">
                            Name
                        </label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Name"
                            name="name"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            defaultValue={user?.displayName}
                            required
                        />
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="label">
                            Email
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            disabled
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        />
                    </div>

                    {/* image change */}
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            name='profileImg'
                            className='hidden'
                        />

                        <img
                            className="w-16 h-16 bg-white rounded-full object-cover drop-shadow-lg"
                            src={img || user?.photoURL || dummyImg}
                            alt="profile picture"
                        />

                        <button
                            type="button"
                            onClick={handleAddImage}
                            className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700">
                            Change Profile Image
                        </button>
                    </div>

                    <input
                        type="submit"
                        className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end"
                        value='Update Profile'
                        disabled={profileUpdateDisable}
                    />
                </form>

                {/* Password change section */}
                <h3 className="text-xl font-medium mb-3">Password</h3>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8">
                    <div className="col-span-2">
                        <label className="label">
                            Current Password
                        </label>
                        <input type="password" placeholder="Current Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            New Password
                        </label>
                        <input type="text" placeholder="New Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            Confirm New Password
                        </label>
                        <input type="password" placeholder="Confirm New Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <button className="col-span-2 btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;