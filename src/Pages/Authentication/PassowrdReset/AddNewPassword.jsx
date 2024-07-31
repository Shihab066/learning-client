import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ErrorPage from "../../ErrorPage/ErrorPage";

const AddNewPassword = () => {
    const { passwordReset, verifyOobCode } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const oobCode = params.get('oobCode');
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [confirmError, setConfirmError] = useState(false);
    const [isLinkExpired, setIsLinkExpired] = useState(true);
    const [loading, setLoading] = useState(true);

    // Validate and enable/disable password update button based on confirmation
    const handleConfirmPassword = (data) => {
        const { newPassword, confirmNewPassword } = data;
        setConfirmError(false);
        if (newPassword && confirmNewPassword.length >= 6) {
            if (newPassword === confirmNewPassword) {
                setConfirmError(false);
            } else {
                setConfirmError(true);
            }
        }
    };

    // Reset password function
    const resetPassword = async (data) => {
        const { newPassword } = data;
        if (confirmError) return;

        if (oobCode) {
            try {
                await verifyOobCode(oobCode);
                await passwordReset(oobCode, newPassword);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Password has been reset successfully!',
                    showConfirmButton: false,
                    timer: 2000
                });
                reset();
                navigate('/login');
            } catch (error) {
                console.error('Something went wrong while resetting password', error);
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Failed to reset password. Please try again.',
                    showConfirmButton: true,
                });
            }
        }
    };

    useEffect(() => {
        if (!oobCode) {
            navigate('/error404', {replace: true});
        }
        else if (oobCode) {
            verifyOobCode(oobCode)
                .then(() => {
                    setIsLinkExpired(false);
                    setLoading(false);
                })
                .catch(() => {
                    setIsLinkExpired(true);
                    setLoading(false);
                })
        }
    }, [oobCode]);

    return (
        <div className="pt-20">
            {
                loading ?
                    <div className='flex justify-center items-center h-[650px]'>
                        <span className="loading loading-spinner text-info loading-lg"></span>
                    </div>
                    :
                    isLinkExpired ?
                        <ErrorPage text="Link Expired!" showButton={false} />
                        :
                        <div className="w-full max-w-[600px] mx-auto py-10 px-10 shadow-2xl rounded-lg space-y-10">
                            <h3 className="text-2xl font-medium text-center">Add New Password</h3>
                            <form
                                onSubmit={handleSubmit(resetPassword)} // Attach resetPassword function to form submission
                                className="grid grid-cols-1 gap-y-8"
                            >
                                {/* New password input field */}
                                <div>
                                    <label className="label">New Password</label>
                                    <input
                                        type="text"
                                        placeholder="New Password"
                                        className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                        autoComplete="off"
                                        {...register("newPassword", {
                                            required: "New Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "New Password must be at least 6 characters long"
                                            },
                                            pattern: {
                                                value: /(?=.*[A-Z])(?=.*[!@#$&*.])/,
                                                message: "New Password must contain at least one uppercase letter and a special character"
                                            }
                                        })}
                                    />
                                    {errors.newPassword && <span className="text-red-600">{errors.newPassword.message}</span>}
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
                                        {...register("confirmNewPassword", { required: "Confirmation Password is required" })}
                                    />
                                    {errors.confirmNewPassword && <span className="text-red-600">{errors.confirmNewPassword.message}</span>}
                                    {confirmError && <span className="text-red-600 block">The password and confirmation password do not match.</span>}
                                </div>

                                <input
                                    type="submit"
                                    className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end"
                                    value="Save Password"
                                />
                            </form>
                        </div>
            }
        </div>
    );
};

export default AddNewPassword;
