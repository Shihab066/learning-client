
import axios from 'axios';
import logo from '../../assets/img/Google.png'
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const SocialLogin = ({from}) => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();
    const handleSignIn = () => {
        googleSignIn()
            .then(result => {
                const user = result.user;
                axios.post('https://summer-camp-school-server-zeta.vercel.app/users', {image:user.photoURL, name: user.displayName || "anonymous", email: user.email, role: 'student' })
                navigate(from, {replace:true})
            })
    }
    return (
        <>
            <div className="divider">OR</div>
            <div onClick={handleSignIn} className='btn btn-ghost flex items-center justify-center gap-4 rounded-lg px-4 py-2 mt-3 border-t-base-200 shadow-md hover:bg-base-200 ease-linear duration-100'>
                <img src={logo} alt="" />
                <span>Continue with google</span>
            </div>
        </>
    );
};

export default SocialLogin;