import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../../../Shared/SocialLogin/SocialLogin";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
import api from "../../../services/baseAPI";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import TickMark from "../../../components/Icons/TickMark";
import WarningCircle from "../../../components/Icons/WarningCircle";

const SignUp = () => {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [confirmPassword, setConfirmPassword] = useState(null);
    const { createUser, updateUser, setJwtToken, setIsLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [axiosSecure] = useAxiosSecure();

    const onSubmit = async (data) => {
        const { name, email, password } = data;
        await createUser(email, password)
            .then(async (result) => {
                const res = await api.post('/token/upload', { uniqueKey: result.user.accessToken });
                const token = await res.data.token;
                localStorage.setItem('access-token', token);
                setJwtToken(token);
                setIsLoggedIn(true);
                const userData = {
                    _id: result?.user?.uid,
                    name: name || "anonymous",
                    email,
                    signupMethod: 'password'
                }
                axiosSecure.post('/user/add', userData)
                    .then(res => {
                        if (res.data.result.insertedId) {
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

    return (
        <div className="mt-20 px-8 pb-10 w-[95%] sm:w-[500px] md:w-[530px] mx-auto shadow-2xl rounded-lg">
            <Helmet>
                <title>Learning Point_signUp</title>
            </Helmet>
            <h3 className="text-center py-8 font-bold text-4xl">SignUp</h3>
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">

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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 ">{confirmPassword == 1 && <span className="text-green-500"><TickMark /></span>} {confirmPassword == 2 && <span className="text-red-600"><WarningCircle /></span>}</div>
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
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 ">{confirmPassword == 1 && <span className="text-green-500"><TickMark /></span>} {confirmPassword == 2 && <span className="text-red-600"><WarningCircle /></span>}</div>
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