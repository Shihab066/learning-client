import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode, fetchSignInMethodsForEmail } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import { jwtDecode } from 'jwt-decode';
import api from "../services/baseAPI";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setloading] = useState(true);

    const createUser = (email, password) => {
        setloading(true)
        return createUserWithEmailAndPassword(auth, email, password)
    };

    const updateUser = (name, image) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: image
        })
    };

    const updateUserPassword = (newPassword) => {
        return updatePassword(user, newPassword)
    };

    const reAuthenticateUser = (credential) => {
        return reauthenticateWithCredential(user, credential)
    };

    const sendAccountRecoveryEmail = (email) => {
        return sendPasswordResetEmail(auth, email)
    };

    const passwordReset = (oobCode, newPassword) => {
        return confirmPasswordReset(auth, oobCode, newPassword)
    };

    const verifyOobCode = (oobCode) => {
        return verifyPasswordResetCode(auth, oobCode)
    };

    const signIn = (email, password) => {
        setloading(true)
        return signInWithEmailAndPassword(auth, email, password)
    };

    const getSignInMehtod = (email) => {
        return fetchSignInMethodsForEmail(auth, email)
    }

    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider)
    };

    const logOut = () => {
        return signOut(auth)
    };

    const [jwtToken, setJwtToken] = useState(localStorage.getItem('access-token'));
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Function to check if the token is expired or about to expire
    const isTokenExpiringSoon = (token) => {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds

        // Refresh if token will expire in the next 30 minutes
        return decodedToken.exp - currentTime < 30 * 60; //  30 minutes
    };

    const verifyAccessToken = async (token) => {
        try {
            const res = await api.post('/token/verify', { token })
            return res.data.valid;
        } catch (error) {
            return false;
        }
    };

    const refreshAccessToken = async (firebaseToken) => {
        try {
            const res = await api.post('/token/upload', { uniqueKey: firebaseToken })
            const token = await res.data.token;
            if (token) {
                localStorage.setItem('access-token', token);  
                setJwtToken(token);
            }
        } catch (error) {
            console.error('Failed to refresh token', error);
        }
    };

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
                    setJwtToken(null);
                    setloading(false);
                }
            } else {
                setloading(false);
            }
        })
        return () => {
            return unsubscribe();
        }
    }, [jwtToken, isLoggedIn])

    const authInfo = {
        auth,
        EmailAuthProvider,
        user,
        loading,
        jwtToken,
        setloading,
        setJwtToken,
        setIsLoggedIn,
        createUser,
        updateUser,
        updateUserPassword,
        reAuthenticateUser,
        sendAccountRecoveryEmail,
        passwordReset,
        verifyOobCode,
        signIn,
        getSignInMehtod,
        googleSignIn,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;