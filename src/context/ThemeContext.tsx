import { createContext, ReactNode, useEffect, useState } from 'react';

type ThemeProps = {
    children: ReactNode;
}

type Theme = 'Light' | 'Dark';

type ThemeContextType = {
    theme: Theme;
    toogleTheme: () => void;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>('Light');

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme])

    function toogleTheme() {
        setCurrentTheme(currentTheme === 'Light' ? 'Dark' : 'Light');
    }

    return (
        <ThemeContext.Provider value={{ theme: currentTheme, toogleTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}