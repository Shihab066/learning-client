
import axios from 'axios';
import logo from '../../assets/icon/google.png'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const SocialLogin = ({ from }) => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    const handleSignIn = () => {
        googleSignIn()
            .then(result => {
                const user = result.user;
                axios.post('https://learning-info-bd.vercel.app/users', { name: user.displayName || "anonymous", email: user.email, image: user.photoURL, role: 'student', signupMethod: 'google' })
                navigate(from, { replace: true })
            })
    }
    return (
        <>
            <div className="divider">OR</div>
            <div onClick={handleSignIn} className='btn btn-ghost flex items-center justify-center gap-4 rounded-lg px-4 py-2 mt-3 border-t-base-200 shadow-md hover:bg-base-200 ease-linear duration-100'>
                <img
                    className='w-6'
                    src={logo}
                    alt="" />
                <span>Continue with google</span>
            </div>
        </>
    );
};

export default SocialLogin;