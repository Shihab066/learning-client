import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../Shared/SocialLogin/SocialLogin";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth();
    const onSubmit = data => {
        const { email, password } = data;
        signIn(email, password)
            .then(() => {
                reset()
                navigate(from, {replace:true})
            })
    }
    return (
        <div className="mt-20 px-8 pb-10 xl:w-[530px] mx-auto shadow-2xl rounded-lg">
            <Helmet>
                <title>Shikho_login</title>
            </Helmet>
            <h3 className="text-center py-8 font-bold text-4xl">Login</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* E-mail field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">E-mail</span>
                    </label>
                    <input type="email" placeholder="E-mail" className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        {...register('email', { required: true })}
                    />
                    {errors.email?.type === 'required' && <span className="text-red-600">This field is required</span>}
                </div>

                {/* Password Field */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="input w-full border-base-300 focus:border-blue-500 active:border-transparent focus:outline-0"
                            {...register("password", { required: true })}
                        />
                        {errors.password?.type === 'required' && <span className="text-red-600">This field is required</span>}
                        <span onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'hide' : 'show'} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl hover:text-blue-700">{showPassword ? <BsEye></BsEye> : <BsEyeSlash></BsEyeSlash>}</span>
                    </div>
                </div>

                {/* Remember me NOT FUNCTIONAL */}
                <div className="flex items-center gap-1 mt-2 ml-1">
                    <input type="checkbox" className="checkbox checkbox-info" />
                    <label className="cursor-pointer label">
                        <span className="label-text">Remember me</span>
                    </label>
                </div>

                {/* Login Button */}
                <input type="submit" value="Login" className="mt-5 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case" />
            </form>
            <p className="mt-5 pl-1">New to Sportex? <Link to={'/signup'} className="text-blue-500 link">SignUp</Link></p>

            <SocialLogin from={from}></SocialLogin>
        </div>
    );
};

export default Login;