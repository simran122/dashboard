import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, FacebookAuthProvider } from 'firebase/auth'
import { auth } from './firebase'


const UserAuthContext = createContext();

function UserAuthContextProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState("")
    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logIn(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }
    function reset(email) {
        return sendPasswordResetEmail(auth, email)
    }
    function googleSignIn() {
        const googleAuthProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleAuthProvider);
    }
    function facebookSignIn() {
        const facebookAuthProvider = new FacebookAuthProvider();
        return signInWithPopup(auth, facebookAuthProvider);
    }


    function phoneLogin(phone) {
        return supabase.auth.signInWithOtp({ phone })

    }



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });


        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        return () => {
            unsubscribe();
        }
    }, []);








    useEffect(() => {
        // Store user data in local storage whenever it changes
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return <UserAuthContext.Provider value={{ user, signUp, logIn, googleSignIn, reset, phoneLogin, facebookSignIn }}>{children}</UserAuthContext.Provider>

}

export default UserAuthContextProvider

export function useUSerAuth() {
    return useContext(UserAuthContext);
}