
import logo from '../../assets/icon/google.png'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../services/baseAPI';
import useAxiosSecure from '../../hooks/useAxiosSecure';
const SocialLogin = ({ from }) => {
    const { googleSignIn, setJwtToken, setIsLoggedIn } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const handleSignIn = () => {
        googleSignIn()
            .then(async (result) => {
                const user = result.user;
                const res = await api.post('/token/upload', { uniqueKey: user.accessToken });
                const token = await res.data.token;
                localStorage.setItem('access-token', token);
                setJwtToken(token);
                setIsLoggedIn(true),
                axiosSecure.post('/user/add', { _id: user.uid, name: user.displayName || "anonymous", email: user.email, image: user.photoURL, role: 'student', signupMethod: 'google' })
                navigate(from, { replace: true })
            })
    }
    return (
        <>
            <div className="divider">Sign in with</div>
            <div onClick={handleSignIn} className='flex items-center justify-center gap-4 rounded-lg px-4 py-2 mt-3 border cursor-pointer select-none hover:shadow duration-150 font-medium'>
                <img
                    className='w-6'
                    src={logo}
                    alt="" />
                <span>Google</span>
            </div>
        </>
    );
};

export default SocialLogin;