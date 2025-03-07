'use client';

import Menu from '@/components/layout/menu/menu';
import Header from '@/components/layout/header/header';
import { createContext, useState } from 'react';
import { usePathname } from 'next/navigation';


interface NavItemProps {
    name: string;
    href: string;
    soon: boolean;
}

interface NavigationContextProps {
    isMenuOpened: boolean;
    setIsMenuOpened: React.Dispatch<React.SetStateAction<boolean>>;
    items: NavItemProps[];
}

export const NavigationContext = createContext({} as NavigationContextProps);

export default function Navigation() {
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const pathname = usePathname();

    const items: NavItemProps[] = pathname.includes('/dashboard') 
        ? [
            { name: 'Contact', href: '/contact', soon: false },
            { name: 'FAQ', href: '/faq', soon: false },
        ]
        : [
            { name: 'Home', href: '/', soon: false },
            { name: 'About', href: '#whyus', soon: false },
            { name: 'FAQ', href: '#faq', soon: false },
            { name: 'Contact', href: '#contact', soon: false },
            { name: 'Student Eligibility Form', href: '/eligibility', soon: false },
            { name: 'Investor Eligibility Form', href: '/investor-eligibility', soon: false },
        ];

    return (
        <NavigationContext.Provider value={{ isMenuOpened, setIsMenuOpened, items }}>
            <Header />
            <Menu items ={items}/>
        </NavigationContext.Provider>
    );
}
