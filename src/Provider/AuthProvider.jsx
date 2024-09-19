import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";

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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, loggeduser => {            
            setUser(loggeduser)
            // console.log('logged user ', loggeduser);
            if (loggeduser) {
                axios.post('https://learning-info-bd.vercel.app/jwt', { email: loggeduser.email })
                    .then(res => {
                        localStorage.setItem('access-token', res.data.token)
                        setloading(false);
                    })
            }
            else {
                localStorage.removeItem('access-token');
                setloading(false)
            }
        })
        return () => {
            return unsubscribe();
        }
    }, [])

    const authInfo = {
        auth,
        EmailAuthProvider,
        user,
        loading,
        setloading,
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