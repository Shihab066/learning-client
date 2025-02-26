import Title from "../../../components/Title/Title";
import useAuth from "../../../hooks/useAuth";
import { toastError, toastSuccess } from "../../../utils/toastUtils";

const PasswordReset = () => {
    const { sendAccountRecoveryEmail, getSignInMehtod } = useAuth();

    // Handle password reset email submission
    const handlePasswordResetEmail = (event) => {
        event.preventDefault();
        const email = event.target.email.value;

        if (email) {
            getSignInMehtod(email)
                .then((signInMethods) => {
                    if (signInMethods.includes('password')) {
                        sendAccountRecoveryEmail(email)
                            .then(() => {
                                toastSuccess('An Email has been sent to your account!');
                                event.target.reset();
                            })
                            .catch((error) => {
                                toastError('Something went wrong!');
                                console.error('Something went wrong while sending password reset email', error);
                            });
                    }
                    else {
                        toastError('No account found with this email')
                    }
                })
                .catch(error => {
                    console.error('Something went wrong while geting userSignupMethod', error);
                });
        }

    };

    return (
        <div className="pt-32">
            <Title title={'Account Recovery'} />
            <div className="w-full max-w-[600px] mx-auto px-4 md:py-10 sm:px-10 md:shadow-xl md:rounded-lg">
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
                        className="btn btn-md capitalize text-white bg-black hover:bg-black hover:bg-opacity-80 w-[200px] justify-self-center"
                        value="Get Password Reset Email"
                    />
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;
