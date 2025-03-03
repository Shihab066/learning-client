import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../../../Shared/SocialLogin/SocialLogin";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import api from "../../../services/baseAPI";
import EyeIcon from "../../../components/Icons/EyeIcon";
import EyeSlash from "../../../components/Icons/EyeSlash";
import Title from "../../../components/Title/Title";

const Login = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, setloading, setJwtToken, setIsLoggedIn } = useAuth();

    const onSubmit = (data) => {
        const { email, password } = data;
        signIn(email, password)
            .then(async (result) => {
                setloading(true)
                const user = result.user;
                const res = await api.post('/token/upload', { uniqueKey: user.accessToken });
                const token = await res.data.token;
                localStorage.setItem('access-token', token);
                setJwtToken(token);
                setIsLoggedIn(true);
                reset();
                navigate(from, { replace: true });
            })
            .catch(() => {
                setloading(false);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Invalid login credentials'
                })
            })
    }

    // manage easy login   
    const handleStudentLogin = () => {
        setValue("email", 'student.learning.point@gmail.com')
        setValue("password", 'Abcd5678..')
    };

    const handleInstructorLogin = () => {
        setValue("email", 'alex.codemaster@gmail.com')
        setValue("password", 'Abcd1234..')
    };

    const handleAdminLogin = () => {
        setValue("email", 'admin.learning.point@gmail.com')
        setValue("password", 'Abcd5678..')
    };


    return (
        <section>
            <Title title={'Login'}/>
            <div className="mx-auto mt-10 sm:mt-20 w-full max-w-sm lg:max-w-lg px-4 sm:px-0">
                <h3 className="text-center py-4 sm:py-8 font-medium text-xl sm:text-3xl">Sign in to your account</h3>
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
                            <span onClick={() => setShowPassword(!showPassword)} title={showPassword ? 'hide' : 'show'} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xl hover:text-blue-700">{showPassword ? <EyeSlash /> : <EyeIcon />}</span>
                        </div>
                        {errors.password?.type === 'required' && <span className="text-red-600">This field is required</span>}
                    </div>

                    {/* account recovery */}
                    <Link
                        to='/account_recovery'
                        className="flex mt-2 ml-1 text-blue-500 link">
                        Forget password?
                    </Link>

                    {/* Login Button */}
                    <input type="submit" value="Sign in" className="mt-5 w-full btn bg-black text-white hover:bg-black hover:bg-opacity-80 normal-case" />
                </form>
                <p className="mt-5 pl-1">New to Learning Point? <Link to={'/signup'} className="text-blue-500 link">SignUp</Link></p>

                <SocialLogin from={from}></SocialLogin>

                {/* easy login */}
                <div className="divider mt-10">Easy Login</div>
                <div className="flex justify-center mt-10 cursor-pointer">
                    <div onClick={handleStudentLogin} className="border border-r-0 border-black px-3 py-1 rounded-l-md hover:bg-gray-100 duration-150">Student</div>
                    <div onClick={handleInstructorLogin} className="border border-black px-3 py-1 hover:bg-gray-100 duration-150">Instructor</div>
                    <div onClick={handleAdminLogin} className="border border-l-0 border-black px-3 py-1 rounded-r-md hover:bg-gray-100 duration-150">Admin</div>
                </div>
            </div>
        </section>
    );
};

export default Login;