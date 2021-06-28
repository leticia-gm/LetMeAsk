import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type Persona = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    persona: Persona | undefined;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [persona, setPersona] = useState<Persona>();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(persona => {
            if (persona) {
                const { displayName, photoURL, uid } = persona

                if (!displayName || !photoURL) {
                    throw new Error('Há informações da conta Google faltando.');
                }

                setPersona({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    async function signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);

        if (result.user) {
            const { displayName, photoURL, uid } = result.user
            if (!displayName || !photoURL) {
                throw new Error('Há informações da conta Google faltando.');
            }

            setPersona({
                id: uid,
                name: displayName,
                avatar: photoURL
            });
        }
    }

    async function signOut() {
        await auth.signOut();
        setPersona(undefined);
    }

    return (
        <AuthContext.Provider value={{ persona, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}