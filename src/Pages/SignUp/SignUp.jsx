

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../../Shared/SocialLogin/SocialLogin";
import { useState } from "react";
import { FaCheck, FaExclamationCircle } from 'react-icons/fa';
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Swal from "sweetalert2";
const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const SignUp = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [confirmPassword, setConfirmPassword] = useState(null);
    const { createUser, updateUser } = useAuth();
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_secret_key}`;
    const [image, setImage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const { name, email, password } = data;        
        await createUser(email, password)
            .then(() => {
                updateUser(name, image)
                    .then(() => {                        
                        setImage('')                        
                        axios.post('https://summer-camp-school-server-zeta.vercel.app/users', {image, name: name || "anonymous", email, role: 'student' })
                            .then(data => {
                                if (data.data.insertedId) {
                                    reset()                                    
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'Registration Successful',
                                        showConfirmButton: false,
                                        timer: 2000
                                    })
                                    navigate('/')
                                }
                            })
                    })
            })
    }

    const handlePassword = (data) => {
        const password = data.password || '';
        const confirmPassword = data.confirmPassword || '';

        if (password.length <= 0 || confirmPassword.length <= 0) {
            setConfirmPassword(null)
        }
        else {
            if (confirmPassword.length > 0) {
                if (password === confirmPassword) {
                    setConfirmPassword(1)
                }
                else {
                    setConfirmPassword(2)
                    return
                }
            }
        }
    }

    const handleImage = async (event) => {
        const img = event.target.files;
        const formData = new FormData();
        formData.append('image', img[0])

        {
            img &&
                await fetch(img_hosting_url, {
                    method: 'POST',
                    body: formData
                    // mode: 'no-cors',
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            const imgURL = data.data.display_url;
                            setImage(imgURL)
                            // console.log(imgURL)
                        }
                        else {
                            setImage('')
                        }
                    })
        }
    }

    return (
        <div className="mt-20 px-8 pb-10 xl:w-[530px] mx-auto shadow-2xl rounded-lg">
            <h3 className="text-center py-8 font-bold text-4xl">SignUp</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">User Name</span>
                    </label>
                    <input type="text" placeholder="Your Name" className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        {...register('name', { required: false })}
                    />
                </div>

                {/* image upload */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Upload Image</span>
                    </label>
                    <input type="file" onChange={handleImage} placeholder="Your Name" className="file-input file-input-bordered border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                    // {...register('img', { required: false })}
                    />
                </div>

                {/* E-mail field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">E-mail</span>
                    </label>
                    <input type="email" placeholder="E-mail" className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        {...register('email', { required: true })}
                    />
                    {errors.email?.type === 'required' && <span className="text-red-600">Field is required</span>}
                </div>

                {/* Password Field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                        <input type='text' placeholder="Password" className="input w-full border-base-300 focus:border-blue-500 active:border-transparent focus:outline-0"
                            {...register("password", {
                                required: true,
                                minLength: 6,
                                pattern: /(?=.*[A-Z])(?=.*[!@#$&*.])/
                            })}
                        />
                        {errors.password?.type === 'required' && <span className="text-red-600">Field is required</span>}
                        {errors.password?.type === 'minLength' && <span className="text-red-600">Password must be atleast 6 characters</span>}
                        {errors.password?.type === 'pattern' && <span className="text-red-600">Password must have one Uppercase and one special character</span>}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 ">{confirmPassword == 1 && <FaCheck className="text-green-500"></FaCheck>} {confirmPassword == 2 && <FaExclamationCircle className="text-red-600"></FaExclamationCircle>}</span>
                    </div>
                </div>

                {/*Confirm Password Field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Confirm Password</span>
                    </label>
                    <div className="relative">
                        <input onChange={watch(handlePassword)} type='password' placeholder="Confirm Password" className="input w-full border-base-300 focus:border-blue-500 active:border-transparent focus:outline-0"
                            {...register("confirmPassword", { required: true })}
                        />
                        {errors.confirmPassword?.type === 'required' && <span className="text-red-600">Field is required</span>}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 ">{confirmPassword == 1 && <FaCheck className="text-green-500"></FaCheck>} {confirmPassword == 2 && <FaExclamationCircle className="text-red-600"></FaExclamationCircle>}</span>
                    </div>
                </div>




                {/* Login Button */}
                <input type="submit" value="SignUp" className="mt-5 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case" />
            </form>
            <p className="mt-5 pl-1">Have an Account? <Link to={'/login'} className="text-blue-500 link">Login</Link></p>

            <SocialLogin></SocialLogin>

        </div>
    );
};

export default SignUp;