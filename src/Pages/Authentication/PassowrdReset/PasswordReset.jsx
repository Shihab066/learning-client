import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const PasswordReset = () => {
    const { sendAccountRecoveryEmail } = useAuth();

    // Handle password reset email submission
    const handlePasswordResetEmail = (event) => {
        event.preventDefault();
        const email = event.target.email.value;

        if (email) {
            axios.get(`https://learning-info-bd.vercel.app/getSignupMethod/${email}`)
                .then(res => {
                    const { signupMethod } = res.data;
                    if (signupMethod === 'password') {
                        sendAccountRecoveryEmail(email)
                            .then(() => {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'An Email has been sent to your account!',
                                    showConfirmButton: false,
                                    timer: 2000
                                });
                                event.target.reset();
                            })
                            .catch((error) => {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'error',
                                    title: 'Something went wrong!',
                                    showConfirmButton: false,
                                    showCloseButton: true
                                });
                                console.error('Something went wrong while sending password reset email', error);
                            });
                    }
                    else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'No account found with this email. Please check the email address.',
                            showConfirmButton: false,
                            showCloseButton: true
                        });
                    }
                })
                .catch(error => {                   
                    console.error('Something went wrong while geting userSignupMethod', error);
                });
        }

    };

    return (
        <div className="pt-32">
            <div className="w-full max-w-[600px] mx-auto py-10 px-10 shadow-2xl rounded-lg">
                <h3 className="text-2xl font-medium text-center">Password Reset</h3>
                <form
                    onSubmit={handlePasswordResetEmail}
                    className="grid space-y-6"
                >
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your E-mail"
                            name="email"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            autoComplete="off"
                            required
                        />
                    </div>

                    <input
                        type="submit"
                        className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[200px] justify-self-center"
                        value="Get Password Reset Email"
                    />
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
