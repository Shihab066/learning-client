import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);

    const createUser = (email, password) => {
        setloading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const updateUser = (name, image) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: image
        })
    }

    const updateUserPassword = (newPassword) => {
        return updatePassword(user, newPassword)
    }

    const reAuthenticateUser = (credential) => {
        return reauthenticateWithCredential(user, credential)
    }

    const sendAccountRecoveryEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
    }

    const passwordReset = (oobCode, newPassword) => {
        return confirmPasswordReset(auth, oobCode, newPassword)
    }

    const verifyOobCode = (oobCode) => {
        return verifyPasswordResetCode(auth, oobCode)
    }

    const signIn = (email, password) => {
        setloading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider)
    }

    const logOut = () => {
        return signOut(auth)
    }

    const [jwtToken, setJwtToken] = useState(localStorage.getItem('access-token'));

    // Function to check if the token is expired or about to expire
    const isTokenExpiringSoon = (token) => {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Refresh if token will expire in the next 5 minutes
        return decodedToken.exp - currentTime < 300; // 300 seconds = 5 minutes
    };

    const verifyAccessToken = async (token) => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/token/verify', { token })
            return res.data.valid;
        } catch (error) {
            return false;
        }
    }

    const refreshAccessToken = async (firebaseToken) => {
        try {
            const res = await axios.post('http://localhost:5000/api/v1/token/upload', { uniqueKey: firebaseToken })
            const token = await res.data.token;
            if (token) {
                localStorage.setItem('access-token', token);
                console.log('refresh token', token);
            }
        } catch (error) {
            console.error('Failed to refresh token', error);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (loggeduser) => {
            if (jwtToken) {
                const isTokenValid = await verifyAccessToken(jwtToken);
                if (loggeduser && isTokenValid) {
                    setUser(loggeduser)
                    setloading(false)

                    // Periodically check token expiration
                    setInterval(() => {

                        if (jwtToken && isTokenExpiringSoon(jwtToken)) {
                            refreshAccessToken(loggeduser.accessToken);
                        }
                    }, 5 * 60 * 1000); // Check every 5 minutes
                }
                else {
                    setUser(null);
                    logOut();
                    localStorage.removeItem('access-token');
                    setloading(false)
                }
            } else {
                setloading(false);
            }
        })
        return () => {
            return unsubscribe();
        }
    }, [jwtToken])

    const authInfo = {
        auth,
        EmailAuthProvider,
        user,
        loading,
        setloading,
        setJwtToken,
        createUser,
        updateUser,
        updateUserPassword,
        reAuthenticateUser,
        sendAccountRecoveryEmail,
        passwordReset,
        verifyOobCode,
        signIn,
        googleSignIn,
        logOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;